import React, { useState } from 'react';
import './AddFriendDiv.css'
import RemoveFriendOverlay from './RemoveFriendOverlay';
import { Card, Heading, Button, Grid } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import '../CreatePost.css'
import './AddFriendDiv.css'

export default function FriendOverlay({ showOverlay, username, currentLoggedInUser, userFriends }) {
    const [showRemoveFriendOverlay, setShowRemoveFriendOverlay] = useState(false);
    const [friendRemoved, setFriendRemoved] = useState(false);

    return (
        <div className="overlay">
            <Card className='container-style'>
                <HeaderWithClose textContent={`Viewing: ${username}`} onClick={() => showOverlay(false)} />
                <Grid alignItems={'flex-end'} justifyContent="flex-end" height="100%" columnGap="1rem" templateColumns={"1fr 1fr"}>
                    <div></div>
                    <Button variation="destructive" height={"40px"} size="small" style={{ marginTop: 5 }} onClick={() => { setShowRemoveFriendOverlay(true) }}>Remove Friend</Button>
                </Grid>
            </Card>
            {showRemoveFriendOverlay && <RemoveFriendOverlay showRemoveOverlay={setShowRemoveFriendOverlay} username={username} currentLoggedInUser={currentLoggedInUser} showParentOverlay={showOverlay} userFriends={userFriends} />}
        </div>
    )
}