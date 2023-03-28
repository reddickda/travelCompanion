import React, { useState } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import { OverlayModal } from './OverlayModal';
import { HeaderWithClose } from './HeaderWithClose';
import { Button } from '@aws-amplify/ui-react';

import '../CreatePost.css'

export default function ScrollableFriendsListOverlay({ data, setSearchResults }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [friendToAdd, setFriendToAdd] = useState("")

    if (!data)
        return null

    return (
        <>
            <OverlayModal>
                <HeaderWithClose textContent={'User Returned:'} onClick={() => setSearchResults([])} />
                <div className='scrollable-div'>{data.map((result, index) => {
                    return <Button
                        className='scrollable-ul'
                        name="User"
                        onClick={() => {
                            setShowAddFriendModal(true)
                            setFriendToAdd(result)
                        }}
                        key={index}>
                        {result}
                    </Button>
                })}
                </div>
            </OverlayModal>
            {showAddFriendModal && <AddFriendOverlayModal showModal={setShowAddFriendModal} friendToAdd={friendToAdd} showParentSearchModal={setSearchResults} />}
        </>
    )
}