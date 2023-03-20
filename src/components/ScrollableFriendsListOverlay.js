import React, { useState, useEffect } from 'react';
import AddFriendOverlayModal from "./AddFriendOverlayModal"
import '../CreatePost.css'

export default function ScrollableFriendsListOverlay({ currentUser, onclick, data, setSearchResults }) {
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [userToAdd, setUserToAdd] = useState("")

    if(!data)
        return null

    return (
        <>
            <div className="overlay">
                <div className='search-results-style'>
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
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setSearchResults([])}>Cancel</button>
                </div>
            </div>
            {showAddFriendModal && <AddFriendOverlayModal currentUser={currentUser} showModal={setShowAddFriendModal} username={userToAdd}/>}
        </>
    )
}