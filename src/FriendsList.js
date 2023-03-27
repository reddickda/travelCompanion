import React, { useState } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"
import FriendsRequestOverlay from './components/FriendsRequestOverlay';
import FriendOverlay from './components/FriendOverlay';
import { Button, Grid, Flex } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './components/HeaderWithClose';
import { OverlayModal } from './components/OverlayModal';
import './FriendsList.css'
import './CreatePost.css'

export default function FriendsList({
    updateOverlayVisibility, currentLoggedInUser, friends, incomingFriendRequests, outgoingFriendRequests
}) {
    const [showAddFriendOverlay, setShowAddFriendOverlay] = useState(false);
    const [showIncomingFriendRequestsOverlay, setShowIncomingFriendRequestsOverlay] = useState(false);
    const [showFriendOverlay, setShowFriendOverlay] = useState(false);
    const [friendClicked, setFriendClicked] = useState(false);

    if (!friends)
        return <>Loading...</>;
    return (
        <>
            <OverlayModal>
                <HeaderWithClose textContent={'Friends List'} onClick={() => updateOverlayVisibility(false)} />
                <Flex>{friends.map((result, index) => {
                    return <Button
                    backgroundColor={"#2b2a33"}
                    size="small"
                    color="white"
                    justifyContent={"center"}
                    alignItems="center"
                    textAlign={"center"}
                        name="Location"
                        onClick={() => {
                            setFriendClicked(result.username);
                            setShowFriendOverlay(true)
                        }}
                        key={index}>
                        {result.username}
                    </Button>
                })}
                </Flex>
                <Grid templateColumns={'1fr 1fr'} columnGap={"1em"}>
                    <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowAddFriendOverlay(true)}>Add Friend</Button>
                    <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowIncomingFriendRequestsOverlay(true)}>{incomingFriendRequests.length} Friend Requests</Button>
                </Grid>
            </OverlayModal>
            {showAddFriendOverlay && <AddFriendDiv showOverlay={setShowAddFriendOverlay} friends={friends} outgoingFriendRequests={outgoingFriendRequests} />}
            {showIncomingFriendRequestsOverlay && <FriendsRequestOverlay incomingFriendRequests={incomingFriendRequests} friends={friends} showOverlay={setShowIncomingFriendRequestsOverlay} />}
            {showFriendOverlay && <FriendOverlay showOverlay={setShowFriendOverlay} username={friendClicked} currentLoggedInUser={currentLoggedInUser} userFriends={friends} />}
        </>
    )
}
