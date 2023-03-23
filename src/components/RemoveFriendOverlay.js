import React from 'react';
import './AddFriendDiv.css'
import { tryRemoveFriend } from '../helpers/apiRemoveFriendHelper'
import { Card, Heading, Button, Grid, Flex } from '@aws-amplify/ui-react';
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
                <Heading color='#d0d4d3' width='100%' level={6}>Are you sure?</Heading>
                <Flex alignItems="flex-end" height="100%" justifyContent={"center"}>
                    <Grid columnGap="0.5rem" templateColumns={"1fr 1fr"}>
                        <Button variation="primary" size="small" height="30px" style={{ marginTop: 5 }} onClick={() => removeFriend()}>Yes</Button>
                        <Button variation="destructive" size="small" height="30px" style={{ marginTop: 5 }} onClick={() => showRemoveOverlay(false)}>No</Button>
                    </Grid>
                </Flex>
            </Card>
        </div>
    )
}