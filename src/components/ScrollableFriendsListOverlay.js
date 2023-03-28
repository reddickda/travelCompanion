import React, { useState } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import { OverlayModal } from './OverlayModal';
import { HeaderWithClose } from './HeaderWithClose';
import { Button } from '@aws-amplify/ui-react';

import '../CreatePost.css'

export default function ScrollableFriendsListOverlay({ currentUser, data, setSearchResults, friends, outgoingFriendRequests }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [userToAdd, setUserToAdd] = useState("")

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
                            setUserToAdd(result)
                        }}
                        key={index}>
                        {result}
                    </Button>
                })}
                </div>
            </OverlayModal>
            {showAddFriendModal && <AddFriendOverlayModal currentUser={currentUser} showModal={setShowAddFriendModal} username={userToAdd} showParentSearchModal={setSearchResults} outgoingFriendRequests={outgoingFriendRequests} friends={friends} />}
        </>
    )
}