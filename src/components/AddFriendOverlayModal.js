import React from 'react';
import '../CreatePost.css'
import './AddFriendOverlayModal.css'
import { trySendFriendRequest } from "../helpers/apiSendFriendRequestHelpers"
import {  Heading, Button, Grid } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import { OverlayModal } from './OverlayModal';

export default function AddFriendOverlayModal({ currentUser, onclick, username, showModal, showParentSearchModal, outgoingFriendRequests, friends }) {
    if (!username)
        return null

    async function sendRequest() {
        var result = await trySendFriendRequest(currentUser, username, friends, outgoingFriendRequests)
        if (result === "Friend already exists or request already sent") {
            alert("Friend already exists or request already sent")
        }
        else {
            alert("Friend request sent")
        }
    }

    return (
        <OverlayModal>
            <HeaderWithClose textContent={'Send Request to:'} onClick={() => showModal(false)} />
            <Heading color='#d0d4d3' width='30vw' level={5}>{username}</Heading>
            <Grid alignContent={'flex-end'} height="100%" columnGap="0.5rem" templateColumns={"1fr 1fr"}>
                <Button height="30px" size="small" variation='primary' style={{ marginTop: 5 }} onClick={() => { showModal(false); showParentSearchModal([]); sendRequest(); }}>Send</Button>
                <div></div>
            </Grid>
        </OverlayModal>
    )
}