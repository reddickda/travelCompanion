import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import { Button, Grid, Menu, Card, Heading, Flex, Text, MenuItem } from "@aws-amplify/ui-react"
import { signOut } from "./utils";
import { Link } from 'react-router-dom'
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


  return (
    <>
      <Card variation={'elevated'} style={{ borderRadius: 0, backgroundColor: '#3f4343', position: 'fixed', top: 0, zIndex: 9999, width: '100%' }}>
        {/* <Flex alignItems={'center'} justifyContent={'space-between'}> */}
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr 1fr 1fr"}>
          <Flex justifyContent={'flex-start'} paddingLeft={10}>
            <Button color={'#bcbec2'} onClick={() => updateFriendsListVis(true)}>Friends</Button>
          </Flex>
          <Heading textAlign={'center'} justifyContent='center' color='#bcbec2' width='30vw' level={6}>My Friend Map</Heading>
          <Flex paddingRight={10} justifyContent={'flex-end'} >
            <Menu menuAlign="end" >
              <MenuItem onClick={() => alert('calendar clicked')}>
                See Posts From Date
              </MenuItem>
              <MenuItem onClick={() => alert(`Signed in as ${loggedInUser}`)}>
                Account
              </MenuItem>
              <MenuItem onClick={() => signOut()}>
                Sign Out
              </MenuItem>
            </Menu>
          </Flex>
        </Grid>
      </Card>
    </>
  )
}

// <div className={linkDivStyle}>
//   //       <Link to="/" className={"link-div"}>My Posts</Link>
//   //       <Link to="/allPostsMap" className={"link-div"}>All Posts</Link>
//   //       <Link to="/myFriendsPosts" className={"link-div"}>Friends Posts</Link>
//   //     </div>