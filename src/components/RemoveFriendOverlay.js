import React from 'react';
import './AddFriendDiv.css'
import { tryRemoveFriend } from '../helpers/apiRemoveFriendHelper'
import { Card, Heading, Button, Grid, Flex } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import '../CreatePost.css'
import './AddFriendDiv.css'

export default function RemoveFriendOverlay({ showRemoveOverlay, username, currentLoggedInUser, showParentOverlay, userFriends }) {

    async function removeFriend() {
        await tryRemoveFriend(currentLoggedInUser, username, userFriends)
        showRemoveOverlay(false);
        showParentOverlay(false);
    }

    return (
        <div className="overlay">
            <Card className='container-style'>
                <HeaderWithClose textContent={'Are you sure?'} onClick={() => showRemoveOverlay(false)} />
                <Grid height="100%" alignItems={'flex-end'} columnGap="1rem" templateColumns={"1fr 1fr"}>
                    <div></div>
                    <Button variation="destructive" size="small" height="30px" style={{ marginTop: 5 }} onClick={() => removeFriend()}>Remove</Button>
                </Grid>
            </Card>
        </div>
    )
}