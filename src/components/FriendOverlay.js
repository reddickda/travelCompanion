import React, { useState, useEffect } from 'react';
import './AddFriendDiv.css'
import { getAllUsers } from '../helpers/apiHelpers'
import ScrollableFriendsListOverlay from './ScrollableFriendsListOverlay';
import RemoveFriendOverlay from './RemoveFriendOverlay';
import { Auth } from 'aws-amplify';
import '../CreatePost.css'
import './AddFriendDiv.css'

export default function FriendOverlay({ showOverlay, username, currentLoggedInUser }) {
    const [showRemoveFriendOverlay, setShowRemoveFriendOverlay] = useState(false);

    return (
        <div className="overlay">
            <div className='friends-div'>
                <h4>{username}</h4>

                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowRemoveFriendOverlay(true)}>Remove Friend</button>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</button>
            </div>
            {showRemoveFriendOverlay && <RemoveFriendOverlay showOverlay={setShowRemoveFriendOverlay} username={username} currentLoggedInUser={currentLoggedInUser}/>}
        </div>
    )
}