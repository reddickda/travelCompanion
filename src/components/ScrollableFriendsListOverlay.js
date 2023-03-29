import React, { useState } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import { OverlayModal } from './OverlayModal';
import { HeaderWithClose } from './HeaderWithClose';
import { Button, Flex } from '@aws-amplify/ui-react';

import '../CreatePost.css'

export default function ScrollableFriendsListOverlay({ data, setSearchResults }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [friendToAdd, setFriendToAdd] = useState("")

    if (!data)
        return null

    return (
        <>
            <OverlayModal backgroundColor={'rgba(0, 0, 0, 0)'}>
                <HeaderWithClose textContent={'User Returned:'} onClick={() => setSearchResults([])} />
                <Flex overflow={'auto'} height="100%" direction={"column"}>{data.map((result, index) => {
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
                </Flex>
            </OverlayModal>
            {showAddFriendModal && <AddFriendOverlayModal showModal={setShowAddFriendModal} friendToAdd={friendToAdd} showParentSearchModal={setSearchResults} />}
        </>
    )
}