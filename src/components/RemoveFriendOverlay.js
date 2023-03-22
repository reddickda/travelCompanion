import React, { useState, useEffect } from 'react';
import './AddFriendDiv.css'
import { getAllUsers } from '../helpers/apiHelpers'
import { tryRemoveFriend } from '../helpers/apiRemoveFriendHelper'
import ScrollableFriendsListOverlay from './ScrollableFriendsListOverlay';
import { Auth } from 'aws-amplify';
import '../CreatePost.css'
import './AddFriendDiv.css'

export default function RemoveFriendOverlay({ showOverlay, username, currentLoggedInUser }) {

    async function removeFriend(){
        await tryRemoveFriend(currentLoggedInUser, username)
        showOverlay(false);
    }

    return (
        <div className="overlay">
            <div className='friends-div'>
                <h4>Are you sure?</h4>

                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => removeFriend()}>Yes</button>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>No</button>
            </div>
        </div>
    )
}