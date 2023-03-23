import React, { useState } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import { Card, Heading, Button, Grid } from '@aws-amplify/ui-react';
import '../CreatePost.css'
import './ScrollableFriendsListOverlay.css'

export default function ScrollableFriendsListOverlay({ currentUser, onclick, data, setSearchResults, friends, outgoingFriendRequests }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [userToAdd, setUserToAdd] = useState("")

    if(!data)
        return null

    return (
        <>
            <div className="overlay">
                <Card className='container-style'>
                    <Heading color='#d0d4d3' width='40vw' level={6}>User Returned:</Heading>
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
                <Button variation='destructive' style={{ marginTop: 5 }} onClick={() => setSearchResults([])}>Cancel</Button>
                </Card>
            </div>
            {showAddFriendModal && <AddFriendOverlayModal currentUser={currentUser} showModal={setShowAddFriendModal} username={userToAdd} showParentSearchModal={setSearchResults} outgoingFriendRequests={outgoingFriendRequests} friends={friends}/>}
        </>
    )
}