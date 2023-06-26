import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import {  Grid, Menu, Card, Heading, Flex, MenuItem } from "@aws-amplify/ui-react"
import { signOut } from "./utils";

import './AlphaHeader.css';

export default function AlphaHeader() {
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
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr 1fr 1fr"}>
        <Flex justifyContent={'flex-start'} paddingLeft={10}>
          </Flex>
          <Heading textAlign={'center'} justifyContent='center' color='#bcbec2' width='30vw' level={6}>My Friend Map</Heading>
          <Flex paddingRight={10} justifyContent={'flex-end'} >
            <Menu menuAlign="end" >
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

const datePickerStyle = { flexDirection: 'column', position: 'fixed', zIndex: 100, top: '20vh', bottom: 0, left: '35vw', right: 0, margin: 'auto', display: 'flex' };