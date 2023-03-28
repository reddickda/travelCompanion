import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import { Button, Grid, Menu, Card, Heading, Flex, MenuItem } from "@aws-amplify/ui-react"
import { signOut } from "./utils";
import { BsCalendarEvent } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import { getPostsByDate } from "./helpers/apiHelpers";
import { useMyContext } from "./ContextProvider";

import "react-datepicker/dist/react-datepicker.css";
import './Header.css';

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const { state, setFriendsListVisible, updateMyFriendsPosts } = useMyContext();
  const { friendsUsernames } = state;

  useEffect(() => {
    async function fetchData() {
      const user = await Auth.currentAuthenticatedUser();
      setLoggedInUser(user.username);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function getFriendsPostsByDate() {
      try {
        const posts = await getPostsByDate(startDate);

        var friendsPostsArray = posts.filter(post => friendsUsernames.indexOf(post.username) >= 0)
        updateMyFriendsPosts(friendsPostsArray);
      } catch (error) {
        console.log('Error fetching posts:', error);
      }
    }

    getFriendsPostsByDate(startDate);
    // whenever start date changes, fire a query to get posts on that day and update friends posts
  }, [startDate])

  return (
    <>
      <Card variation={'elevated'} style={{ borderRadius: 0, backgroundColor: '#3f4343', position: 'fixed', top: 0, zIndex: 9999, width: '100%' }}>
        <Grid height={50} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr 1fr 1fr"}>
          <Flex justifyContent={'flex-start'} paddingLeft={10}>
            <Button color={'#bcbec2'} onClick={() => setFriendsListVisible()}>Friends</Button>
          </Flex>
          <Heading textAlign={'center'} justifyContent='center' color='#bcbec2' width='30vw' level={6}>My Friend Map</Heading>
          <Flex paddingRight={10} justifyContent={'flex-end'} >
            <Menu menuAlign="end" >
              <MenuItem justifyContent={'space-between'} onClick={() => setShowDatePicker(true)}>
                See Posts From Date
                <BsCalendarEvent />
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
      {showDatePicker &&
        <div onClick={() => setShowDatePicker(false)} style={datePickerStyle}>
          <DatePicker
            onClickOutside={() => setShowDatePicker(false)}
            startOpen={true}
            showIcon
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
      }
    </>
  )
}

const datePickerStyle = { flexDirection: 'column', position: 'fixed', zIndex: 100, top: '20vh', bottom: 0, left: '35vw', right: 0, margin: 'auto', display: 'flex' };