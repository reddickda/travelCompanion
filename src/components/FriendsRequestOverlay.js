import React, { useState, useEffect } from 'react';
import { tryAcceptFriendRequest } from "../helpers/apiAcceptFriendRequestHelper";
import { tryRejectFriendRequest } from '../helpers/apiRejectFriendRequestHelper';
import { Auth } from 'aws-amplify';
import { Heading, Button, Grid } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import { OverlayModal } from './OverlayModal';
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
        await tryAcceptFriendRequest(userId, newFriend, friends, incomingFriendRequests)
    }

    async function rejectRequest(userId, newFriend) {
         await tryRejectFriendRequest(userId, newFriend, incomingFriendRequests)
    }

    return (
        <>
            <OverlayModal>
                <HeaderWithClose textContent={'Friend Requests'} onClick={() => showOverlay(false)} />
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
            </OverlayModal>
            {showRequest &&
                <OverlayModal>
                    <HeaderWithClose textContent={'Accept Request from'} onClick={() => setShowRequest(false)} />
                    <Heading textAlign={'center'} width='100%' level={5}>{userToAdd}</Heading>
                    <Grid height={'100%'} alignItems='flex-end' templateColumns={'1fr 1fr'} columnGap={'1em'} >
                        <Button height={'40px'} size="small" variation='primary' onClick={() => { setShowRequest(false); acceptRequest(currentLoggedInUser, userToAdd); }}>Accept</Button>
                        <Button height={'40px'} size="small" variation="destructive" onClick={() => { setShowRequest(false); rejectRequest(currentLoggedInUser, userToAdd); }}>Reject</Button>
                    </Grid>
                </OverlayModal>}
        </>
    )
}