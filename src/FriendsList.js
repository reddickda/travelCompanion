import React, { useState, useEffect } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"
import FriendsRequestOverlay from './components/FriendsRequestOverlay';
import FriendOverlay from './components/FriendOverlay';
import { Card, Heading, Button, Grid } from '@aws-amplify/ui-react';
import { CloseButton } from './components/CloseButton';
import { HeaderWithClose } from './components/HeaderWithClose';
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
            <div className="overlay">
                <Card padding={5} variation={"elevated"} className="container-style">
                <HeaderWithClose textContent={'Friends List'} onClick={() => updateOverlayVisibility(false)} />
                    <div className='scrollable-div'>{friends.map((result, index) => {
                        return <ul
                            className='scrollable-ul'
                            name="Location"
                            onClick={() => {
                                setFriendClicked(result.username);
                                setShowFriendOverlay(true)
                            }}
                            key={index}>
                            {result.username}
                        </ul>
                    })}
                    </div>
                    <Grid templateColumns={'1fr 1fr'} columnGap={"1em"}>
                        <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowAddFriendOverlay(true)}>Add Friend</Button>
                        <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowIncomingFriendRequestsOverlay(true)}>{incomingFriendRequests.length} Friend Requests</Button>
                    </Grid>
                </Card>
                {showAddFriendOverlay && <AddFriendDiv showOverlay={setShowAddFriendOverlay} friends={friends} outgoingFriendRequests={outgoingFriendRequests} />}
                {showIncomingFriendRequestsOverlay && <FriendsRequestOverlay incomingFriendRequests={incomingFriendRequests} friends={friends} showOverlay={setShowIncomingFriendRequestsOverlay} />}
                {showFriendOverlay && <FriendOverlay showOverlay={setShowFriendOverlay} username={friendClicked} currentLoggedInUser={currentLoggedInUser} userFriends={friends} />}
            </div>
        </>
    )
}
