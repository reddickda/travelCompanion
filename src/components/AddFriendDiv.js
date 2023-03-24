import React, { useState, useEffect } from 'react';
import './AddFriendDiv.css'
import { getAllUsers } from '../helpers/apiHelpers'
import ScrollableFriendsListOverlay from './ScrollableFriendsListOverlay';
import { Auth } from 'aws-amplify';
import { Card, Heading, Button, Grid, SearchField, Flex } from '@aws-amplify/ui-react';
import '../CreatePost.css'
import './AddFriendDiv.css'

export default function AddFriendDiv({ showOverlay, outgoingFriendRequests, friends }) {
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
                if (returnedUsers.length === 1 && returnedUsers[0] === currentLoggedInUser) {
                    return null;
                } else {
                    setSearchResults(returnedUsers);
                }
            }
        }

        const handleSubmit = (event) => {
            let returnedUsers = searchFriends(event.target.value)
            if (returnedUsers.length === 1 && returnedUsers[0] === currentLoggedInUser) {
                return null;
            } else {
                setSearchResults(returnedUsers);
            }
        }

        return <SearchField size="small" className="input-style" type="text" onKeyDown={handleKeyDown} placeholder={selectedUser.length === 0 ? "Search For User" : selectedUser} />
    }

    return (
        <div className="overlay">
            <Card className='container-style'>
                <Heading padding={2} color='#d0d4d3' width='40vw' level={6}>Adding Friend</Heading>
                <Flex direction="column" height={"100%"}>
                    <FriendSearch />
                    <div style={buttonDivStyle}>
                        <Button variation="destructive" size="small" style={{ marginTop: 5 }} onClick={() => showOverlay(false)}>Cancel</Button>
                    </div>
                </Flex>
            </Card>
            {searchResults.length > 0 && <ScrollableFriendsListOverlay currentUser={currentLoggedInUser} data={searchResults} setSearchResults={setSearchResults} outgoingFriendRequests={outgoingFriendRequests} friends={friends} />}
        </div>
    )
}

const buttonDivStyle = { display: "flex", alignItems: "flex-end", justifyContent: "flex-end", height: "100%" }