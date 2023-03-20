import React, { useState } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"

import './CreatePost.css'

export default function FriendsList({
    updateOverlayVisibility, updateFriends, friends, incomingFriendRequests
}) {
    const [showAddFriendOverlay, setShowAddFriendOverlay] = useState(false);
    const [showIncomingFriendRequestsOverlay, setShowIncomingFriendRequestsOverlay] = useState(false);

    if (!friends)
        return <>Loading...</>;

    return (
        <>
            <div className="overlay"><div className='friends-div'><div className='scrollable-div'>{friends.map((result, index) => {
                return <ul
                    className='scrollable-ul'
                    name="Location"
                    onClick={() => {
                        console.log("clicked")
                    }}
                    key={index}>
                    {result.username}
                </ul>

            })}
            </div>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowAddFriendOverlay(true)}>Add Friend</button>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowIncomingFriendRequestsOverlay(true)}>Friend Requests</button>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => updateOverlayVisibility(false)}>Cancel</button>
            </div>
            {showAddFriendOverlay && <AddFriendDiv showOverlay={setShowAddFriendOverlay} />}
            </div>
        </>
    )
}
