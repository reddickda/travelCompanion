import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route
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
    <>
      <HashRouter>
          <div className={contentStyle}>
            <Header />
            <hr className={dividerStyle} />
            <Button title="New Post" onClick={() => updateOverlayVisibility(true)} />
            <Routes>
              <Route exact path="/" element={<Posts posts={posts} />} />
              <Route path="/post/:id" element={<Post />} />
              <Route exact path="/myposts" element={<Posts posts={myPosts} />} />
              <Route exact path="/allPostsMap" element={<Map posts={posts} />}/>
            </Routes>
          </div>
          <button type="button" onClick={() => signOut()}>Sign out</button>
        </HashRouter>
        { showOverlay && (
          <CreatePost
            updateOverlayVisibility={updateOverlayVisibility}
            updatePosts={setPostState}
            posts={posts}
          />
        )}
    </>
  );
}

const dividerStyle = css`
  margin-top: 15px;
`

const contentStyle = css`
  min-height: calc(100vh - 45px);
  padding: 0px 40px;
`

export default withAuthenticator(App);