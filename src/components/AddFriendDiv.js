import React, { useState, useEffect } from 'react';
import './AddFriendDiv.css'
import { getAllUsers } from '../apiHelpers'
import { all } from 'axios';
import ScrollableFriendsListOverlay from './ScrollableFriendsListOverlay';
import { Auth } from 'aws-amplify';
import '../CreatePost.css'

export default function AddFriendDiv({ showOverlay }) {
    const [allCurrentUsers, setAllCurrentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([])
    const [selectedUser, setSelectedUser] = useState("")
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState("");

    useEffect(() => {
        async function fetchData() {
            let allUsers = await getAllUsers()
            let allUsersIds = allUsers.data.listUsers.items.map((user) => user.username)
            const user = await Auth.currentAuthenticatedUser();
            setCurrentLoggedInUser(user.username);
            setAllCurrentUsers(allUsersIds)
        }
        fetchData();
    }, []);

    function searchFriends(input) {
        return allCurrentUsers.filter((user) =>
            user.toLowerCase().includes(input.toLowerCase())
        );
    }
    
    const FriendSearch = () => {
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            let returnedUsers = searchFriends(event.target.value)
            if(returnedUsers.length === 1 && returnedUsers[0] === currentLoggedInUser)
            {
                return null;
            }else{
                setSearchResults(returnedUsers);
            }
          }
        }
    
        return <input className="input-style" type="text" onKeyDown={handleKeyDown} placeholder={selectedUser.length === 0 ? "Search For User" : selectedUser} />
      }

    return (
        <div className="overlay">
            <div className='friends-div'>
                <div>Adding Friend</div>
                <FriendSearch />
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</button>
            </div>
            {searchResults.length > 0 && <ScrollableFriendsListOverlay currentUser={currentLoggedInUser} data={searchResults} setSearchResults={setSearchResults}/>}
        </div>
    )
}