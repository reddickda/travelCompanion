import React, { useState } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import { Card, Heading, Button, Grid } from '@aws-amplify/ui-react';
import '../CreatePost.css'
import './ScrollableFriendsListOverlay.css'
import { HeaderWithClose } from './HeaderWithClose';

export default function ScrollableFriendsListOverlay({ currentUser, onclick, data, setSearchResults, friends, outgoingFriendRequests }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [userToAdd, setUserToAdd] = useState("")

    if(!data)
        return null

    return (
        <>
            <div className="overlay">
                <Card padding={5} variation={"elevated"} className='container-style'>
                    <HeaderWithClose textContent={'User Returned:'} onClick={() => setSearchResults([])} />
                    <div className='scrollable-div'>{data.map((result, index) => {
                        return <ul
                            className='scrollable-ul'
                            name="User"
                            onClick={() => {
                                setShowAddFriendModal(true)
                                setUserToAdd(result)
                            }}
                            key={index}>
                            {result}
                        </ul>
                    })}
                    </div>
                </Card>
            </div>
            {showAddFriendModal && <AddFriendOverlayModal currentUser={currentUser} showModal={setShowAddFriendModal} username={userToAdd} showParentSearchModal={setSearchResults} outgoingFriendRequests={outgoingFriendRequests} friends={friends}/>}
        </>
    )
}