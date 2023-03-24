import React, { useState, useEffect } from "react";
import { css } from '@emotion/css';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, Grid, Tabs } from "@aws-amplify/ui-react"
import { signOut } from "./utils";
import './Header.css';

export default function Header({ updateOverlayVisibility, updateFriendsListVis }) {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    async function fetchData() {
      const user = await Auth.currentAuthenticatedUser();
      setLoggedInUser(user.username);
    }
    fetchData();
  }, []);


  const UserComponent = () => {
    return <h3>Logged in as user: {loggedInUser}</h3>
  }

  return (
    <>
      <div className="header-container" >
        <h1 className={headerStyle}>TravelCompanion</h1>
        {loggedInUser && <UserComponent />}
      </div >
      <div className="header-container-lower">
        <Button onClick={() => updateOverlayVisibility(true)}>New Post</Button>
        <Button onClick={() => updateFriendsListVis(true)}>Friends</Button>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
      <div className={linkDivStyle}>
        <Link to="/" className={"link-div"}>My Posts</Link>
        {/* <Link to="/allPostsMap" className={"link-div"}>All Posts</Link> */}
        <Link to="/myFriendsPosts" className={"link-div"}>Friends Posts</Link>
      </div>

    </>
  )
}

const headerContainer = css`
`

const linkDivStyle = css`
  margin-bottom: 5px;
  display: flex;
  align-items: flex-end;
  @media screen and (max-width: 500px){
    justify-content: center;
  }
`

const headerStyle = css`
  display:flex;
  font-size: 40px;
  margin-top: 0px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
    justify-content: center;
  }
`

// const linkStyle = css`
//   display: inline-block;
//   padding: 5px 10px;
//   background-color: #45668f ;
//   color: #fff;
//   font-size: 16px;
//   font-weight: bold;
//   text-decoration: none;
//   border-radius: 10px;
//   transition: background-color 0.3s ease;
//   margin-right: 10px;
//   :hover {
//     color: #058aff;
//   }
//   @media screen and (max-width: 500px) {
//     justify-content: center;
//   }
// `