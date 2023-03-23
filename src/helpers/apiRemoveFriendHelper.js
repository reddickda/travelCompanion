
import { API } from 'aws-amplify';
import { updateUser } from '../graphql/mutations';
import { getFriendsById } from './apiSendFriendRequestHelpers';

export async function tryRemoveFriend(userId, friendUserId, userFriends) {
    let currentUserFriends = await getFriendsById(userId) ?? []; // can pass this
    // let currentUserFriends = userFriends ?? [];
    let friendUserFriends = await getFriendsById(friendUserId) ?? [];

    // if friend to remove is in both lists
    if (currentUserFriends.includes(friendUserId) && friendUserFriends.includes(userId)) {
        console.log("removing friend")
        // remove friend from logged in user
        const indexOfFriendToRemove = currentUserFriends.indexOf(friendUserId);
        if (indexOfFriendToRemove > -1) {
            currentUserFriends.splice(indexOfFriendToRemove, 1);
        }

        const updateUserInput = {
            id: userId,
            friends: currentUserFriends
        }

        // remove user from friend
        const indexOfUserToRemove = friendUserFriends.indexOf(userId);
        if (indexOfUserToRemove > -1) {
            friendUserFriends.splice(indexOfUserToRemove, 1);
        }

        const updateFriendInput = {
            id: friendUserId,
            friends: friendUserFriends
        }
        await API.graphql({
            query: updateUser,
            variables: { input: updateUserInput },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })

        return await API.graphql({
            query: updateUser,
            variables: { input: updateFriendInput },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })
    } else {
        return "bad remove request"
    }
}