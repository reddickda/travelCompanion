import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { css } from '@emotion/css';
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import Post from './Post';
import '@aws-amplify/ui-react/styles.css';
import { Heading, Button, withAuthenticator } from '@aws-amplify/ui-react';
import { createApiUser, getCurrentApiUser, getPostsLastDay } from "./helpers/apiHelpers";
import { signOut } from "./utils";
import CreatePost from "./CreatePost";
import FriendsList from "./FriendsList";
import AwsMap from "./AwsMap";
import { onUpdateUser } from "./graphql/subscriptions";
import Footer  from "./Footer"
 
const components = {
  Header() {
    return <Heading backgroundColor={'background.primary'} color={'black'} level={1} padding={3}>Travel Companion</Heading>
  },
  Footer() {
    return <Heading backgroundColor={'background.primary'} color={'black'} level={5} padding={3}>&copy; All Rights Reserved</Heading>
  }
}

function App() {
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);
  const [myFriendsPosts, updateMyFriendsPosts] = useState([]);
  const [friendsListVis, updateFriendsListVis] = useState(false);
  const [myFriendsList, setMyFriendsList] = useState([]);
  const [myIncomingFriendRequests, setMyIncomingFriendsRequests] = useState([]);
  const [myOutgoingFriendRequests, setMyOutgoingFriendsRequests] = useState([]);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState("");

  useEffect(() => {
    fetchPostsAndSetPostState();
  }, []);

  useEffect(() => {
    if (currentLoggedInUser) {
      const subscription = API.graphql(graphqlOperation(onUpdateUser, {
        username: currentLoggedInUser
      })).subscribe({
        next: async ({ provider, value }) => {
          let newFriendRequestCount = await getCurrentApiUser(currentLoggedInUser);
          let allFriends = await Promise.all(newFriendRequestCount.data.getUser.friends.map(async (friendId) => {
            const friendData = await getCurrentApiUser(friendId);
            return friendData.data.getUser;
          }))
          setMyFriendsList(allFriends);
          setMyIncomingFriendsRequests(newFriendRequestCount.data.getUser.incomingFriendRequests)
          setMyOutgoingFriendsRequests(newFriendRequestCount.data.getUser.outgoingFriendRequests)
        },
        error: (error) => console.warn(error)
      })
      return () => subscription.unsubscribe();
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
    setCurrentLoggedInUser(user.username)
    setMyIncomingFriendsRequests(loggedInUserIncomingFriendRequests)
    setMyOutgoingFriendsRequests(loggedInUserOutgoingFriendRequests)
    setMyFriendsList(loggedInUserFriendsData)
    updateMyPosts(myPostData);
    updatePosts(postsArray);
    updateMyFriendsPosts(friendsPostsArray)
  }

  return (
    <div className={wrapperDiv}>
      <HashRouter>
        <div className={contentStyle}>
          <Routes>
            <Route path="/" element={<AwsMap updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={myPosts} />} />
            {/* <Route path="/post/:id" element={<Post />} /> */}
            {/* <Route path="/allPostsMap" element={<AwsMap updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={posts} />} /> */}
            <Route path="/myFriendsPosts" element={<AwsMap updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={myFriendsPosts} />} />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
      <Footer updateOverlayVisibility={updateOverlayVisibility} />
      {showOverlay && (
        <CreatePost
          updateOverlayVisibility={updateOverlayVisibility}
          updatePosts={fetchPostsAndSetPostState}
          posts={posts}
        />
      )}
      {friendsListVis &&
        <FriendsList
          updateOverlayVisibility={updateFriendsListVis}
          updateFriends={setMyFriendsList}
          friends={myFriendsList}
          incomingFriendRequests={myIncomingFriendRequests}
          currentLoggedInUser={currentLoggedInUser}
          outgoingFriendRequests={myOutgoingFriendRequests}
        />}
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
  padding: 0px 40px;
  @media screen and (max-width: 500px) {
    padding: 0px 0px;
  }
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