import React, { useState, useEffect } from 'react';
import '../CreatePost.css'
import { updateUserOutgoingFriends } from "../apiHelpers"

export default function AddFriendOverlayModal({ currentUser, onclick, username, showModal }) {

    if (!username)
        return null

    async function sendRequest(){
        var result = await updateUserOutgoingFriends(currentUser, username)
        console.log(result)
    }

    return (
        <>
            <div className="overlay">
                <div className='search-results-style'>
                    Send Request to {username}?
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => {showModal(false); sendRequest();}}>Send Request</button>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showModal(false)}>Cancel</button>
                </div>
            </div>
        </>
    )
}