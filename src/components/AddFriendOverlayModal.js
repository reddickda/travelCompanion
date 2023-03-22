import React from 'react';
import '../CreatePost.css'
import { trySendFriendRequest } from "../helpers/apiSendFriendRequestHelpers"

export default function AddFriendOverlayModal({ currentUser, onclick, username, showModal }) {

    if (!username)
        return null

    async function sendRequest(){
        var result = await trySendFriendRequest(currentUser, username)
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