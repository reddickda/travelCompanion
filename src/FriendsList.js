import React, { useState } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"
import FriendsRequestOverlay from './components/FriendsRequestOverlay';
import FriendOverlay from './components/FriendOverlay';
import { Button, Grid, Flex } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './components/HeaderWithClose';
import { OverlayModal } from './components/OverlayModal';
import './FriendsList.css'
import './CreatePost.css'
import { useMyContext } from './ContextProvider';

export default function FriendsList({
    outgoingFriendRequests
}) {
    const [showAddFriendOverlay, setShowAddFriendOverlay] = useState(false);
    const [showIncomingFriendRequestsOverlay, setShowIncomingFriendRequestsOverlay] = useState(false);
    const [showFriendOverlay, setShowFriendOverlay] = useState(false);
    const [friendClicked, setFriendClicked] = useState(false);

    const { state, setFriendsListNotVisible } = useMyContext();
    const { friendsUsernames, incomingFriendRequests } = state;
    
    if (!friendsUsernames)
        return <>Loading...</>;
    return (
        <>
            <OverlayModal>
                <HeaderWithClose textContent={'Friends List'} onClick={() => setFriendsListNotVisible()} />
                <Flex>{friendsUsernames.map((result, index) => {
                    return <Button
                    backgroundColor={"#2b2a33"}
                    size="small"
                    color="white"
                    justifyContent={"center"}
                    alignItems="center"
                    textAlign={"center"}
                        name="Location"
                        onClick={() => {
                            setFriendClicked(result);
                            setShowFriendOverlay(true)
                        }}
                        key={index}>
                        {result}
                    </Button>
                })}
                </Flex>
                <Grid templateColumns={'1fr 1fr'} columnGap={"1em"}>
                    <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowAddFriendOverlay(true)}>Add Friend</Button>
                    <Button fontSize={'12px'} height='40px' size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowIncomingFriendRequestsOverlay(true)}>{incomingFriendRequests.length} Friend Requests</Button>
                </Grid>
            </OverlayModal>
            {showAddFriendOverlay && <AddFriendDiv showOverlay={setShowAddFriendOverlay} outgoingFriendRequests={outgoingFriendRequests} />}
            {showIncomingFriendRequestsOverlay && <FriendsRequestOverlay showOverlay={setShowIncomingFriendRequestsOverlay} />}
            {showFriendOverlay && <FriendOverlay showOverlay={setShowFriendOverlay} selectedFriend={friendClicked} />}
        </>
    )
}
