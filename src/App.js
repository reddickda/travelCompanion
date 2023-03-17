import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { css } from '@emotion/css';
import { Storage, Auth } from 'aws-amplify';
import Post from './Post';
import Map from './Map';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { getAllPosts, createApiUser, getCurrentApiUser, getPostsByUsername, getPostsLastDay } from "./apiHelpers";
import CreatePost from "./CreatePost";

function App() {
  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);
  const [myFriendsPosts, updateMyFriendsPosts] = useState([]);
  const [friendsListVis, updateFriendsListVis] = useState(false);

  /* fetch posts when component loads */
  useEffect(() => {
    fetchPostsAndSetPostState();
  }, []);

  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

  async function fetchPostsAndSetPostState() {
    /* query the API, ask for 100 items */
    let postData = await getPostsLastDay();
    let postsArray = postData.data.listPosts.items;

    // TODO error handling
    /* map over the image keys in the posts array, get signed image URLs for each image */
    postsArray = await Promise.all(postsArray.map(async post => {
      const imageKey = await Storage.get(post.image);
      post.image = imageKey;
      return post;
    }));
    /* update the posts array in the local state */
    checkAndCreateUserAndSetPosts(postsArray);
  }

  async function checkAndCreateUserAndSetPosts(postsArray) {
    const user = await Auth.currentAuthenticatedUser();
    let userFromApi = await getCurrentApiUser(user.username);

    const userReturned = !userFromApi.data.getUser

    if(userReturned) {
      await createApiUser(user);
    }

    const myPostData = postsArray.filter(p => p.owner === user.username);

    var friendsPostsArray = postsArray.filter(post => userFromApi.data.getUser.friends.indexOf(post.username) === 0 )
    console.log({friendsPostsArray})

    updateMyPosts(myPostData);
    updatePosts(postsArray);
    updateMyFriendsPosts(friendsPostsArray)
  }

  return (
    <div className={wrapperDiv}>
      <HashRouter>
          <div className={contentStyle}>
            <Routes>
              <Route path="/" element={<Map updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={myPosts} />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/allPostsMap" element={<Map updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={posts} />}/>
              <Route path="/myFriendsPosts" element={<Map updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility} posts={myFriendsPosts} />}/>
              <Route path='*' element={	<Navigate to="/" />}/>
            </Routes>
          </div>
        </HashRouter>
        <button style={{height:40, width: 100}} type="button" onClick={() => signOut()}>Sign out</button>
        { showOverlay && (
          <CreatePost
            updateOverlayVisibility={updateOverlayVisibility}
            updatePosts={fetchPostsAndSetPostState}
            posts={posts}
          />
        )}
        {friendsListVis && <div className="friends-div">
        <button onClick={() => updateFriendsListVis(false)}>Close</button> 
    </div> }
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

const buttonStyle = css`
  display: flex;
  @media screen and (max-width: 500px){
    justify-content: center;
  }
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

export default withAuthenticator(App, {services: services, signUpAttributes: ['given_name','family_name', 'email'] });