import React, { useState, useEffect } from 'react';
import './AddFriendDiv.css'
import { getAllUsers } from '../apiHelpers'
import { all } from 'axios';

export default function AddFriendDiv({ showOverlay }) {
    const [allCurrentUsers, setAllCurrentUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let allUsers = await getAllUsers()
            let allUsersIds = allUsers.data.listUsers.items.map((user) => user.username)
            setAllCurrentUsers(allUsersIds)
        }
        fetchData();
    }, []);


    if(allCurrentUsers)
    {
        console.log(allCurrentUsers)
    }
    // const LocationSearch = () => {
    //     const handleKeyDown = (event) => {
    //       if (event.key === 'Enter') {
    //         search(event.target.value)
    //         setShowSearchResults(true)
    //       }
    //     }

    /// TODO build out search component using list of ids for friends
    return (
        <div className="overlay">
            <div className='friends-div'>
                <div>Adding Friend</div>
                <input placeholder='Type Friends Username'></input>
                <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</button>
            </div>
        </div>
    )
}