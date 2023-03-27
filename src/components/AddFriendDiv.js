import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../helpers/apiHelpers'
import ScrollableFriendsListOverlay from './ScrollableFriendsListOverlay';
import { Auth } from 'aws-amplify';
import { SearchField, Flex } from '@aws-amplify/ui-react';
import { HeaderWithClose } from './HeaderWithClose';
import { OverlayModal } from './OverlayModal';

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
            let returnedUsers = searchFriends(event)
            if (returnedUsers.length === 1 && returnedUsers[0] === currentLoggedInUser) {
                return null;
            } else {
                setSearchResults(returnedUsers);
            }
        }

        return <SearchField size="small" className="input-style" type="text" onSubmit={(event) => handleSubmit(event)} onKeyDown={handleKeyDown} placeholder={selectedUser.length === 0 ? "Search For User" : selectedUser} />
    }

    return (
        <>
            <OverlayModal>
                <HeaderWithClose textContent='Adding Friend' onClick={() => showOverlay(false)} />
                <Flex direction="column" height={"100%"}>
                    <FriendSearch />
                </Flex>
            </OverlayModal>
            {searchResults.length > 0 && <ScrollableFriendsListOverlay currentUser={currentLoggedInUser} data={searchResults} setSearchResults={setSearchResults} outgoingFriendRequests={outgoingFriendRequests} friends={friends} />}
        </>
    )
}