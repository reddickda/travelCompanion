import React from 'react';
import { tryRemoveFriend } from '../helpers/apiRemoveFriendHelper'
import { Button, Grid } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import { OverlayModal } from './OverlayModal';
import { useMyContext } from '../ContextProvider';

export default function RemoveFriendOverlay({ showRemoveOverlay, friendToRemove, showParentOverlay, userFriends }) {
    const { state } = useMyContext();
    const { loggedInUser, friendsUsernames } = state;

    async function removeFriend() {
        await tryRemoveFriend(loggedInUser, friendToRemove, friendsUsernames)
        showRemoveOverlay(false);
        showParentOverlay(false);
    }

    return (
        <OverlayModal>
            <HeaderWithClose textContent={'Are you sure?'} onClick={() => showRemoveOverlay(false)} />
            <Grid height="100%" alignItems={'flex-end'} columnGap="1rem" templateColumns={"1fr 1fr"}>
                <div></div>
                <Button variation="destructive" size="small" height="30px" style={{ marginTop: 5 }} onClick={() => removeFriend()}>Remove</Button>
            </Grid>
        </OverlayModal>
    )
}