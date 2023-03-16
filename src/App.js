import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { css } from '@emotion/css';
import { Storage, Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import Post from './Post';
import CreatePost from './CreatePost';
import Button from './Button';
import Map from './Map';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { getAllPosts, createApiUser, getCurrentApiUser, getPostsByUsername } from "./apiHelpers";

function App() {
  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);
  const [myFriendsPosts, updateMyFriendsPosts] = useState([]);

  /* fetch posts when component loads */
  useEffect(() => {
    fetchPostsAndSetPostState();
  }, []);

  async function fetchPostsAndSetPostState() {
    /* query the API, ask for 100 items */
    let postData = await getAllPosts();
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

    console.log({userFromApi})

    const userReturned = !userFromApi.data.getUser

    if(userReturned) {
      await createApiUser(user);
    }

    console.log(userFromApi)
    console.log({user})
    // console.log({postsArray})
    // check if user exists
    // 
    const myPostData = postsArray.filter(p => p.owner === user.username);

    // get friends posts
    // var friendsPostsPromise = await getAllFriendsPosts(userFromApi.data.getUser.friends);

    // var friendsPosts = friendsPostsPromise[0].data.postsByUsernameAndName.items;

    console.log({postsArray})

    var friendsPostsArray = postsArray.filter(post => userFromApi.data.getUser.friends.indexOf(post.username) === 0 )
    console.log({friendsPostsArray})

    updateMyPosts(myPostData);
    updatePosts(postsArray);
    updateMyFriendsPosts(friendsPostsArray)

    // await API.graphql({
    //   query: updateUser,
    //   variables: { input: {id:user.username, friends:{items:{ username: "buttons"}}} },
    //   authMode: 'AMAZON_COGNITO_USER_POOLS',
    // });
  }

  async function getAllFriendsPosts(friends){
    const promises = friends.map(async (friend) => {
        return await getPostsByUsername(friend);
    })

    return Promise.all(promises);
  }

  return (
    <div className={wrapperDiv}>
      <HashRouter>
          <div className={contentStyle}>
            <Routes>
              <Route path="/" element={<Map posts={myPosts} />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/allPostsMap" element={<Map posts={posts} />}/>
              <Route path="/myFriendsPosts" element={<Map posts={myFriendsPosts} />}/>
              <Route path='*' element={	<Navigate to="/" />}/>
            </Routes>
          </div>
          <Button title="New Post" onClick={() => updateOverlayVisibility(true)} />
        </HashRouter>
        { showOverlay && (
          <CreatePost
            updateOverlayVisibility={updateOverlayVisibility}
            updatePosts={fetchPostsAndSetPostState}
            posts={posts}
          />
        )}
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