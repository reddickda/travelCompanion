import React, { useState } from 'react';
import AddFriendDiv from "./components/AddFriendDiv"
import FriendsRequestOverlay from './components/FriendsRequestOverlay';
import FriendOverlay from './components/FriendOverlay';
import './FriendsList.css'
import './CreatePost.css'

export default function FriendsList({
    updateOverlayVisibility, currentLoggedInUser, friends, incomingFriendRequests
}) {
    const [showAddFriendOverlay, setShowAddFriendOverlay] = useState(false);
    const [showIncomingFriendRequestsOverlay, setShowIncomingFriendRequestsOverlay] = useState(false);
    const [showFriendOverlay, setShowFriendOverlay] = useState(false);
    const [friendClicked, setFriendClicked] = useState(false);


    if (!friends)
        return <>Loading...</>;

    return (
        <>
            <div className="overlay"><div className='friends-div'><h4>Friends:</h4><div className='scrollable-div'>{friends.map((result, index) => {
                return <ul
                    className='scrollable-ul'
                    name="Location"
                    onClick={() => {
                        setFriendClicked(result.username);
                        setShowFriendOverlay(true)
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
            {showIncomingFriendRequestsOverlay && <FriendsRequestOverlay incomingFriendRequests={incomingFriendRequests} friends={friends} showOverlay={setShowIncomingFriendRequestsOverlay} />}
            {showFriendOverlay && <FriendOverlay showOverlay={setShowFriendOverlay} username={friendClicked} currentLoggedInUser={currentLoggedInUser}/>}
            </div>
        </>
    )
}
