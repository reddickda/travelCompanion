import React, { useState, useEffect } from 'react';
import { tryAcceptFriendRequest } from "../helpers/apiAcceptFriendRequestHelper";
import { tryRejectFriendRequest } from '../helpers/apiRejectFriendRequestHelper';
import { Auth } from 'aws-amplify';
import '../CreatePost.css'

export default function FriendsRequestOverlay({ showOverlay, friends, incomingFriendRequests }) {
    const [showRequest, setShowRequest] = useState(false);

    const [userToAdd, setUserToAdd] = useState("");
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState("");

    useEffect(() => {
        async function fetchData() {
            const user = await Auth.currentAuthenticatedUser();
            setCurrentLoggedInUser(user.username);
        }
        fetchData();
    }, []);
    if(incomingFriendRequests.length === 0 || !currentLoggedInUser) {
        return null;
    }
    
    // get incoming friend requests
    // list in the scrollable modal - with username tied as newusers to add
    // onclick - popup for accept
    // do a accept friend request api call

    async function acceptRequest(userId, newFriend){
        var result = await tryAcceptFriendRequest(userId, newFriend)
    }

    async function rejectRequest(userId, newFriend){
        var result = await tryRejectFriendRequest(userId, newFriend)
    }

    return (
        <>
            <div className="overlay">
                <div className='friends-div'>
                    Friend Requests
                    <div className='scrollable-div'>{incomingFriendRequests.map((result, index) => {
                        return <ul
                            className='scrollable-ul'
                            name="User"
                            onClick={() => {
                                setShowRequest(true)
                                setUserToAdd(result)
                            }}
                            key={index}>
                            {result}
                        </ul>
                    })}
                    </div>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</button>
                </div>
                {showRequest && <div style={{zIndex:10001}} className="overlay">
                <div className='friends-div'>
                    Accept Request from {userToAdd}?
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => {setShowRequest(false); acceptRequest( currentLoggedInUser, userToAdd);}}>Accept Request</button>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => {setShowRequest(false); rejectRequest( currentLoggedInUser, userToAdd);}}>Reject Request</button>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowRequest(false)}>Cancel</button>
                </div>
            </div>}
            </div>
        </>
    )
}