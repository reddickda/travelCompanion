import React from 'react';
import '../CreatePost.css'
import './AddFriendOverlayModal.css'
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
                <div className='friends-div'>
                    <h4>Send Request to user:</h4>
                    <h5> {username}</h5>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => {showModal(false); sendRequest();}}>Send Request</button>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showModal(false)}>Cancel</button>
                </div>
            </div>
        </>
    )
}