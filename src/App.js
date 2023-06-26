import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { css } from '@emotion/css';
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Heading, withAuthenticator, Card, Text } from '@aws-amplify/ui-react';
import { createApiUser, getCurrentApiUser, getPostsLastDay, getPostsByIds } from "./helpers/apiHelpers";
import CreatePost from "./CreatePost";
import FriendsList from "./FriendsList";
import AwsMap from "./AwsMap";
import { onCreatePost, onUpdateUser } from "./graphql/subscriptions";
import Footer from "./Footer"
import Header from "./Header"
import LoginHeading from "./LoginHeading";
import WelcomeOverlay from './components/WelcomeOverlay';
import { useMyContext } from "./ContextProvider";
import './App.css'
import AlphaHeader from "./AlphaHeader";


const components = {
  Header() {
    return <><WelcomeOverlay /><LoginHeading /></>
  },
  Footer() {
    return <Heading style={{ borderRadius: 0, backgroundColor: '#3f4343', position: 'fixed', bottom: 0, left:0, zIndex: 9000, width: '100%' }} className="footer" backgroundColor={'background.primary'} color={'black'} level={5} padding={3}>&copy; All Rights Reserved</Heading>
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);
  const [showAlphaOverlay, setShowAlphaOverlay] = useState(false);
  // const [myFriendsPosts, updateMyFriendsPosts] = useState([]);

  const { state, updateLoggedInUser, updateFriendsUsernames, updateFriendsData, updateIncomingFriendRequests, updateOutgoingFriendRequests, updateMyFriendsPosts } = useMyContext();
  const { isFriendsListVisible, isCreatePostVisible, friendsData, loggedInUser, myFriendsPosts, friendsUsernames } = state;

  function assessLoggedInState() {
    Auth.currentAuthenticatedUser()
      .then((sess) => {
        console.log(sess.attributes.sub)
        console.log("logged in")
      // only david is allowed in right now
        if(sess.attributes.sub !== "7695b25b-54d1-470f-875c-b7db2d007906"){
          console.log("here")
          setShowAlphaOverlay(true);
          setLoggedIn(false);
        }else{
          setShowAlphaOverlay(false);
          setLoggedIn(true);
        }
      }).catch(() => {
        console.log("not logged in")
        setLoggedIn(false);
      })
  }

  useEffect(() => {
    assessLoggedInState();
    console.log(loggedIn)
    if (loggedIn) { // TODO set logic for showing the map or showing a new custom login
      fetchPostsAndSetPostState();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedInUser) {
      const subscription = API.graphql(graphqlOperation(onUpdateUser, {
        username: loggedInUser
      })).subscribe({
        next: async ({ provider, value }) => {
          
          let newFriendRequestCount = await getCurrentApiUser(loggedInUser);
          let allFriends = await Promise.all(newFriendRequestCount.data.getUser.friends.map(async (friendId) => {
            const friendData = await getCurrentApiUser(friendId);
            return friendData.data.getUser;
          }))
          let allFriendsAsUsername = allFriends.map((friend) => friend.username); //  get all usernames of friends and set here for live refresh

          // context
          updateOutgoingFriendRequests(newFriendRequestCount.data.getUser.outgoingFriendRequests)
          updateFriendsUsernames(allFriendsAsUsername);
          updateFriendsData(allFriends);
          updateIncomingFriendRequests(newFriendRequestCount.data.getUser.incomingFriendRequests)
        },
        error: (error) => console.warn(error)
      })
     
      // const friendsPosts = await getPostsByIds(loggedInUserFriends);

      const onCreatePostSubscription = API.graphql(graphqlOperation(onCreatePost, {
        username: loggedInUser
      })).subscribe({
        next: async({ value: { data } }) => {
          if(friendsUsernames.indexOf(data.onCreatePost.username) >= 0){
            let newMyFriendsPosts = [...myFriendsPosts, data.onCreatePost]

            newMyFriendsPosts = await Promise.all(newMyFriendsPosts.map(async post => {
              const imageKey = await Storage.get(post.image);
              post.image = imageKey;
              return post;
            }));
            updateMyFriendsPosts(newMyFriendsPosts);
          }
        },
      });

      return () =>{ subscription.unsubscribe(); onCreatePostSubscription.unsubscribe();}
    }


  })

  async function fetchPostsAndSetPostState() {
    let postData = await getPostsLastDay();
    let postsArray = postData.data.listPosts.items;

    /* map over the image keys in the posts array, get signed image URLs for each image */
    postsArray = await Promise.all(postsArray.map(async post => {
      const imageKey = await Storage.get(post.image);
      post.image = imageKey;
      return post;
    }));

    checkAndCreateUserAndSetPosts(postsArray);
  }

  async function checkAndCreateUserAndSetPosts(postsArray) {
    const user = await Auth.currentAuthenticatedUser();
    let userFromApi = await getCurrentApiUser(user.username);

    // try catch here
    const userNotReturned = !userFromApi.data.getUser

    if (userNotReturned) {
      await createApiUser(user);
    }

    let loggedInUserFriends = userFromApi.data.getUser.friends;

    var loggedInUserFriendsData = await Promise.all(loggedInUserFriends.map(async (friendId) => {
      const friendData = await getCurrentApiUser(friendId);
      return friendData.data.getUser;
    }))

    let loggedInUserIncomingFriendRequests = userFromApi.data.getUser.incomingFriendRequests;
    let loggedInUserOutgoingFriendRequests = userFromApi.data.getUser.outgoingFriendRequests;

    const myPostData = postsArray.filter(p => p.owner === user.username);

    var friendsPostsArray = postsArray.filter(post => userFromApi.data.getUser.friends.indexOf(post.username) >= 0)

    let friendPostData = await getPostsByIds(loggedInUserFriends);

    friendPostData = await Promise.all(friendPostData.map(async post => {
      const imageKey = await Storage.get(post.image);
      post.image = imageKey;
      return post;
    }));

    updateMyPosts(myPostData);
    updatePosts(postsArray);

    // using context
    updateMyFriendsPosts(friendPostData)
    updateOutgoingFriendRequests(loggedInUserOutgoingFriendRequests)
    updateIncomingFriendRequests(loggedInUserIncomingFriendRequests)
    updateLoggedInUser(user.username);
    updateFriendsUsernames(loggedInUserFriends);
    updateFriendsData(loggedInUserFriendsData)
  }

  return (
    <div className={wrapperDiv}>
      {showAlphaOverlay && <div style={{ position: 'absolute', height: '100vh', width: '100vw', zIndex: 100000, backgroundColor: '#0d1a26' }}>
      <AlphaHeader logout={setLoggedIn} />
        <div style={{display:'flex', width:'100vw', height:'100vh', justifyContent:'center', alignItems: 'center'}}>
        <Card borderRadius={10} width={200} padding={5} style={{backgroundColor: '#304050'}}><Text>This project is in its alpha stages. For more info contact the creator at reddickdav@gmail.com</Text></Card>
        </div>
        </div>}
      <Header logout={setLoggedIn} />
      <HashRouter>
        <div className={contentStyle}>
          <Routes>
            <Route path="/myPosts" element={<AwsMap posts={myPosts} />} />
            {/* <Route path="/post/:id" element={<Post />} /> */}
            {/* <Route path="/allPostsMap" element={<AwsMap updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={posts} />} /> */}
            <Route path="/" element={<AwsMap posts={myFriendsPosts} />} />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />

      </HashRouter>
      {isCreatePostVisible && (
        <CreatePost
          updatePosts={fetchPostsAndSetPostState}
          posts={posts}
        />
      )}
      {isFriendsListVisible &&
        <FriendsList />}
    </div>
  )
}

const wrapperDiv = css`
  height: 100%;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  outline: 1px solid red;
`

const contentStyle = css`
height: 100%;
  padding: 0px 0px;
`
const services = {
  async handleSignUp(formData) {
    let { username, password, attributes } = formData;
    // custom username
    username = username.toLowerCase();
    attributes.email = attributes.email.toLowerCase();

    return Auth.signUp({
      username,
      password,
      attributes,
      autoSignIn: {
        enabled: true,
      },
    });
  },
};

export default withAuthenticator(App, { components: components, services: services, signUpAttributes: ['given_name', 'family_name', 'email'] });