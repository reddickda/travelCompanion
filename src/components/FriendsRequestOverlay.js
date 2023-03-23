import React, { useState, useEffect } from 'react';
import { tryAcceptFriendRequest } from "../helpers/apiAcceptFriendRequestHelper";
import { tryRejectFriendRequest } from '../helpers/apiRejectFriendRequestHelper';
import { Auth } from 'aws-amplify';
import { Card, Heading, Button, Grid, Flex } from '@aws-amplify/ui-react';
import '../CreatePost.css'

export default function FriendsRequestOverlay({ showOverlay, friends, incomingFriendRequests }) {
    const [showRequest, setShowRequest] = useState(false);

    const [userToAdd, setUserToAdd] = useState("");
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState("");

    useEffect(() => {
        async function fetchData() {
            const user = await Auth.currentAuthenticatedUser();
            setCurrentLoggedInUser(user.username);
        }
        fetchData();
    }, []);
    if (incomingFriendRequests.length === 0 || !currentLoggedInUser) {
        return null;
    }

    async function acceptRequest(userId, newFriend) {
        var result = await tryAcceptFriendRequest(userId, newFriend, friends, incomingFriendRequests)
    }

    async function rejectRequest(userId, newFriend) {
        var result = await tryRejectFriendRequest(userId, newFriend, incomingFriendRequests)
    }

    return (
        <>
            <div className="overlay">
                <Card className='container-style'>
                    Friend Requests
                    <div className='scrollable-div'>{incomingFriendRequests.map((result, index) => {
                        return <ul
                            className='scrollable-ul'
                            name="User"
                            onClick={() => {
                                setShowRequest(true)
                                setUserToAdd(result)
                            }}
                            key={index}>
                            {result}
                        </ul>
                    })}
                    </div>
                    <Button size="small" height="30px" variation="destructive" style={{ marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</Button>
                </Card>
                {showRequest && <div style={{ zIndex: 10001 }} className="overlay">
                    <Card className='container-style'>
                        <Heading color='#d0d4d3' width='100%' level={6}>Accept Request from</Heading> 
                        <Heading width='100%' level={5}>{userToAdd}</Heading>
                        <Flex height="100%" direction="column" justifyContent={"flex-end"}>
                            <Button variation='primary' onClick={() => { setShowRequest(false); acceptRequest(currentLoggedInUser, userToAdd); }}>Accept Request</Button>
                            <Button variation="destructive" onClick={() => { setShowRequest(false); rejectRequest(currentLoggedInUser, userToAdd); }}>Reject Request</Button>
                            <Button variation="destructive" onClick={() => setShowRequest(false)}>Cancel</Button>
                        </Flex>
                    </Card>
                </div>}
            </div>
        </>
    )
}