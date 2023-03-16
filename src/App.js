import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { css } from '@emotion/css';
import { API, Storage, Auth } from 'aws-amplify';
import { listPosts, getUser, batchGetUsers } from './graphql/queries';
import { createUser, updateUser } from './graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import Posts from './Posts';
import Post from './Post';
import Header from './Header';
import CreatePost from './CreatePost';
import Button from './Button';
import Map from './Map';
import NotFound from "./NotFound";
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);

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
    console.log(user)
    let userFromApi = await API.graphql({ query: getUser, variables: { username: user.username, id: user.username }});
    console.log({userFromApi})
    if(!userFromApi.data.getUser) {
      const userInfo = { firstName: user.attributes.given_name, lastName:user.attributes.family_name, username: user.username, email: user.attributes.email.toLowerCase(), id: user.username}; //id: uuidv4()
      await API.graphql({
        query: createUser,
        variables: { input: userInfo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });
    }

    // check if user exists
    // 
    const myPostData = postsArray.filter(p => p.owner === user.username);
    updateMyPosts(myPostData);
    updatePosts(postsArray);
    console.log(myPostData)
    var myDataNoDates = myPostData.map(post => {
      return {id: post.id, name:post.name, latLong: post.latLong, description: post.description, location:post.location, owner: post.owner, image: post.image}
    })


    // this is all self referential
    // need to reference other posts
    // TODO figure out
    // user has list of friends ids
    // get all the users from the ids provided in friends list
    var currUser = await API.graphql({
      query: getUser,
      variables: {id: user.username},
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    var friends = await API.graphql({
      query: batchGetUsers,
      variables: {ids: ["buttons","test2_user"]}
    })

    var fullInput = {id: "test2_user", posts:myDataNoDates}
    console.log(friends)
    // await API.graphql({
    //   query: updateUser,
    //   variables: { input: {id:user.username, friends:{items:{ username: "buttons"}}} },
    //   authMode: 'AMAZON_COGNITO_USER_POOLS',
    // });
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