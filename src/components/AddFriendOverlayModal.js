import React, { useState } from 'react';
import '../CreatePost.css'
import './AddFriendOverlayModal.css'
import { trySendFriendRequest } from "../helpers/apiSendFriendRequestHelpers"
import { Card, Heading, Button, Grid, Flex } from '@aws-amplify/ui-react';

export default function AddFriendOverlayModal({ currentUser, onclick, username, showModal, showParentSearchModal, outgoingFriendRequests, friends }) {
    if (!username)
        return null

    async function sendRequest() {
        var result = await trySendFriendRequest(currentUser, username, friends, outgoingFriendRequests)
        if(result === "Friend already exists or request already sent")
        {
            alert("Friend already exists or request already sent")
        }
        else{
            alert("Friend request sent")
        }
        // console.log(result)
    }

    return (
        <>
            <div className="overlay">
                <Card className='container-style'>
                    <Heading color='#d0d4d3' width='100%' level={6}>Send Request to:</Heading>
                    <Heading color='#d0d4d3' width='30vw' level={5}>{username}</Heading>
                    <Flex justifyContent={"space-evenly"} alignItems="flex-end" height="100%">
                        <Grid columnGap="0.5rem" templateColumns={"1fr 1fr"}>
                            <Button height="30px"  size="small" variation='primary' style={{ marginTop: 5 }} onClick={() => { showModal(false); showParentSearchModal([]); sendRequest(); }}>Send</Button>
                            <Button height="30px" size="small" variation="destructive" style={{ marginTop: 5 }} onClick={() => showModal(false)}>Cancel</Button>
                        </Grid>
                    </Flex>
                </Card>
            </div>
        </>
    )
}
// todo show friend request sent or failed