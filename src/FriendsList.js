import React, { useState } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"
import FriendsRequestOverlay from './components/FriendsRequestOverlay';
import FriendOverlay from './components/FriendOverlay';
import { Card, Heading, Button } from '@aws-amplify/ui-react';
import './FriendsList.css'
import './CreatePost.css'

export default function FriendsList({
    updateOverlayVisibility, currentLoggedInUser, friends, incomingFriendRequests
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
                <Card variation={"elevated"} className="container-style">
                <Heading color='#d0d4d3' width='30vw' level={6}>Friends List</Heading>
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
                    <Button size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowAddFriendOverlay(true)}>Add Friend</Button>
                    <Button size="small" variation="primary" style={{ marginTop: 5 }} onClick={() => setShowIncomingFriendRequestsOverlay(true)}>Friend Requests</Button>
                    <Button size="small" variation="destructive" style={{ marginTop: 5 }} onClick={() => updateOverlayVisibility(false)}>Cancel</Button>
                </Card>
                {showAddFriendOverlay && <AddFriendDiv showOverlay={setShowAddFriendOverlay} />}
                {showIncomingFriendRequestsOverlay && <FriendsRequestOverlay incomingFriendRequests={incomingFriendRequests} friends={friends} showOverlay={setShowIncomingFriendRequestsOverlay} />}
                {showFriendOverlay && <FriendOverlay showOverlay={setShowFriendOverlay} username={friendClicked} currentLoggedInUser={currentLoggedInUser} />}
            </div>
        </>
    )
}
