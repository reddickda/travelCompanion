import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';
import { getIncomingFriendRequests, getOutgoingFriendRequests, getFriendsById } from './apiSendFriendRequestHelpers';

export async function tryAcceptFriendRequest(userId, newFriend) {
    let currentFriends = await getFriendsById(userId) ?? [];
    let friendToAddFriends = await getFriendsById(newFriend) ?? [];
    let currentIncomingFriendRequests = await getIncomingFriendRequests(userId) ?? [];
    let newFriendOutgoingFriendRequests = await getOutgoingFriendRequests(newFriend) ?? [];

    if (currentIncomingFriendRequests.includes(newFriend) && !currentFriends.includes(newFriend) && !friendToAddFriends.includes(userId)) {

        // remove friend to add from incoming friends array
        const indexOfFriendToAdd = currentIncomingFriendRequests.indexOf(newFriend);
        if (indexOfFriendToAdd > -1) {
            currentIncomingFriendRequests.splice(indexOfFriendToAdd, 1);
        }
        const updateIncomingInput = {
            id: userId,
            incomingFriendRequests: 
                currentIncomingFriendRequests
            ,
            friends: [
                ...currentFriends,
                newFriend
            ]
        }

        // remove curent user from friend to add outgoing
        const indexOfCurrentUser = newFriendOutgoingFriendRequests.indexOf(userId);
        if (indexOfCurrentUser > -1) { // only splice array when item is found
            newFriendOutgoingFriendRequests.splice(indexOfCurrentUser, 1); // 2nd parameter means remove one item only
        }

        const updateOutoingInput = {
            id: newFriend,
            outgoingFriendRequests: 
                newFriendOutgoingFriendRequests
            ,
            friends: [
                ...friendToAddFriends,
                userId
            ]
        }

        // send both updates
        await API.graphql({
            query: updateUser,
            variables: { input: updateIncomingInput },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })

        return await API.graphql({
            query: updateUser,
            variables: { input: updateOutoingInput },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })
    } else {
        return "bad friend request"
    }
}