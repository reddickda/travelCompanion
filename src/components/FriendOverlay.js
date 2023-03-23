import React, { useState } from 'react';
import './AddFriendDiv.css'
import RemoveFriendOverlay from './RemoveFriendOverlay';
import { Card, Heading, Button, Grid } from '@aws-amplify/ui-react';

import '../CreatePost.css'
import './AddFriendDiv.css'

export default function FriendOverlay({ showOverlay, username, currentLoggedInUser, userFriends }) {
    const [showRemoveFriendOverlay, setShowRemoveFriendOverlay] = useState(false);
    const [friendRemoved, setFriendRemoved] = useState(false);

    return (
        <div className="overlay">
            <Card className='container-style'>
                <Heading color='#d0d4d3' width='30vw' level={6}>{username}</Heading>
                <div style={{display:"flex", alignItems:"flex-end", height:"100%"}}>
                <Grid columnGap="0.5rem" templateColumns={"1fr 1fr"}>
                    <Button variation="destructive" height={"40px"} size="small" style={{ marginTop: 5 }} onClick={() =>{ setShowRemoveFriendOverlay(true)}}>Remove Friend</Button>
                    <Button variation="destructive" height={"40px"} size="small" style={{ marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</Button>
                </Grid>
                </div>
            </Card>
            {showRemoveFriendOverlay && <RemoveFriendOverlay showRemoveOverlay={setShowRemoveFriendOverlay} username={username} currentLoggedInUser={currentLoggedInUser} showParentOverlay={showOverlay} userFriends={userFriends} />}
        </div>
    )
}