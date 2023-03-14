import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { css } from '@emotion/css';
import { API, Storage, Auth } from 'aws-amplify';
import { listPosts } from './graphql/queries';

import Posts from './Posts';
import Post from './Post';
import Header from './Header';
import CreatePost from './CreatePost';
import Button from './Button';
import Map from './Map';
import NotFound from "./NotFound";


function App() {
  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);

  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}
  /* fetch posts when component loads */
  useEffect(() => {
      fetchPosts();
  }, []);
  async function fetchPosts() {
    /* query the API, ask for 100 items */
    let postData = await API.graphql({ query: listPosts, variables: { limit: 100 }});
    let postsArray = postData.data.listPosts.items;
    /* map over the image keys in the posts array, get signed image URLs for each image */
    postsArray = await Promise.all(postsArray.map(async post => {
      const imageKey = await Storage.get(post.image);
      post.image = imageKey;
      return post;
    }));
    /* update the posts array in the local state */
    setPostState(postsArray);
  }
  async function setPostState(postsArray) {
    const user = await Auth.currentAuthenticatedUser();
    const myPostData = postsArray.filter(p => p.owner === user.username);
    updateMyPosts(myPostData);
    updatePosts(postsArray);
  }
  return (
    <div className={wrapperDiv}>
      <HashRouter>
          <div className={contentStyle}>
            <Routes>
              <Route path="/" element={<Map posts={myPosts} />} />
              <Route path="/post/:id" element={<Post />} />
              {/* <Route exact path="/myposts" element={<Posts posts={myPosts} />} /> */}
              {/* <Route exact path="/myPostsMap" element={<Posts posts={myPosts} />} /> */}
              <Route path="/allPostsMap" element={<Map posts={posts} />}/>
              <Route path='*' element={	<Navigate to="/" />}/>
            </Routes>
          </div>
          <Button title="New Post" onClick={() => updateOverlayVisibility(true)} />
        </HashRouter>
        { showOverlay && (
          <CreatePost
            updateOverlayVisibility={updateOverlayVisibility}
            updatePosts={setPostState}
            posts={posts}
          />
        )}
    </div>
  );
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

export default withAuthenticator(App);