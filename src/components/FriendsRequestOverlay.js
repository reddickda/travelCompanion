import React, { useState, useEffect } from 'react';
import { tryAcceptFriendRequest } from "../helpers/apiAcceptFriendRequestHelper"
import { Auth } from 'aws-amplify';
import '../CreatePost.css'

export default function FriendsRequestOverlay({ showOverlay, friends, incomingFriendRequests }) {
    const [showAcceptRequest, setShowAcceptRequest] = useState(false);
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
        console.log(newFriend)

        var result = await tryAcceptFriendRequest(userId, newFriend)
         console.log(result)
    }

    return (
        <>
            <div className="overlay">
                <div className='search-results-style'>
                    Friend Requests
                    <div className='scrollable-div'>{incomingFriendRequests.map((result, index) => {
                        return <ul
                            className='scrollable-ul'
                            name="User"
                            onClick={() => {
                                setShowAcceptRequest(true)
                                setUserToAdd(result)
                            }}
                            key={index}>
                            {result}
                        </ul>
                    })}
                    </div>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</button>
                </div>
                {showAcceptRequest && <div style={{zIndex:10001}} className="overlay">
                <div className='search-results-style'>
                    Accept Request from {userToAdd}?
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => {setShowAcceptRequest(false); acceptRequest( currentLoggedInUser, userToAdd);}}>Accept Request</button>
                    <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowAcceptRequest(false)}>Cancel</button>
                </div>
            </div>}
            </div>
        </>
    )
}