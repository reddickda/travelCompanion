import React from 'react';
import { css } from '@emotion/css';
import { Link } from 'react-router-dom';
import {  Auth } from 'aws-amplify';

export default function Header() {
  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}
  return (
    <div className={headerContainer}>
      <div className={headerDiv} >
        <h1 className={headerStyle}>TravelCompanion</h1>
        <button style={{height:40}} type="button" onClick={() => signOut()}>Sign out</button>
      </div>
      <div className={linkDivStyle}>
        <Link to="/" className={linkStyle}>My Posts</Link>
        <Link to="/allPostsMap" className={linkStyle}>All Posts</Link>
      </div>
      {/* <Link to="/allPostsMap" className={linkStyle}>Map</Link> */}
    </div>
  )
}

const headerContainer = css`
`

const headerDiv = css`
  display:flex;
  justify-content: space-between;
  @media screen and (max-width: 500px){
    justify-content: center;
  }
`

const linkDivStyle = css`
  display: flex;
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

const linkStyle = css`
  color: black;
  font-weight: bold;
  text-decoration: none;
  margin-right: 10px;
  :hover {
    color: #058aff;
  }
  @media screen and (max-width: 500px) {
    justify-content: center;
  }
`