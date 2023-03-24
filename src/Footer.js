import React, { useState, useEffect } from "react";
import { css } from '@emotion/css';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button, Grid, Tabs, Card } from "@aws-amplify/ui-react"
import { signOut } from "./utils";
import './Header.css';

export default function Footer({ updateOverlayVisibility, updateFriendsListVis }) {
    const [buttonBottom, setButtonBottom] = useState(20);
    const [scrollDir, setScrollDir] = useState("scrolling down");

  useEffect(() => {
    // const handleResize = () => {
    //   const screenHeight = window.screen.height;
    //   const viewportHeight = window.innerHeight;
    //   console.log({screenHeight})
    //   console.log({viewportHeight})
    //   const searchBarHeight = screenHeight - viewportHeight;
    // };
    const screenHeight = window.screen.height;
    if(scrollDir === "scrolling down"){
        setButtonBottom(screenHeight + 20); // add some margin
    }else{
        setButtonBottom(screenHeight); // add some margin
    }


  }, [scrollDir]);


useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
  
    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
  
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      const scrollVar = scrollY > lastScrollY ? "scrolling down" : "scrolling up"

      console.log({scrollVar})
      setScrollDir(scrollY > lastScrollY ? "scrolling down" : "scrolling up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
  
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };
  
    window.addEventListener("scroll", onScroll);
    console.log(scrollDir);
  
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);
//   const [loggedInUser, setLoggedInUser] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       const user = await Auth.currentAuthenticatedUser();
//       setLoggedInUser(user.username);
//     }
//     fetchData();
//   }, []);


//   const UserComponent = () => {
//     return <h3>Logged in as user: {loggedInUser}</h3>
//   }
  // return (
  //   <>
  //   <Grid>

  //   </Grid>
  //   </>
  // )

    return (
        <Button variation="primary" style={{bottom: 200, left:50, boxShadow:'0 5px 3px rgba(0,0,0,0.7)', position:'absolute'}} onClick={() => updateOverlayVisibility(true)}>New Post</Button>
            // <Card style={{bottom: 200, left:50, position:'absolute'}}>
            //     Test
            // </Card>
    )

//   return (
//     <>
//       <div className="header-container" >
//         <h1 className={headerStyle}>TravelCompanion</h1>
//         {loggedInUser && <UserComponent />}
//       </div >
//       <div className="header-container-lower">
//         <Button onClick={() => updateOverlayVisibility(true)}>New Post</Button>
//         <Button onClick={() => updateFriendsListVis(true)}>Friends</Button>
//         <Button onClick={() => signOut()}>Sign out</Button>
//       </div>
//       <div className={linkDivStyle}>
//         <Link to="/" className={"link-div"}>My Posts</Link>
//         <Link to="/allPostsMap" className={"link-div"}>All Posts</Link>
//         <Link to="/myFriendsPosts" className={"link-div"}>Friends Posts</Link>
//       </div>

//     </>
//   )
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