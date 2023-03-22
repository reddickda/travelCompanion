import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';


export async function trySendFriendRequest(userId, newFriend) {
    // get current user friends and outgoing friends lists
    let currentFriends = await getFriendsById(userId) ?? [];
    let currentOutgoingFriendRequests = await getOutgoingFriendRequests(userId) ?? [];
    let newFriendIncomingFriendRequests = await getIncomingFriendRequests(newFriend) ?? [];

    // if friend to add is not in either list, update outgoing
    if (!currentFriends.includes(newFriend) && !currentOutgoingFriendRequests.includes(newFriend) && !newFriendIncomingFriendRequests.includes(userId)) {
        // update current user outgoing
        const updateOutgoingInput = {
            id: userId,
            outgoingFriendRequests: [
                ...currentOutgoingFriendRequests,
                newFriend
            ]
        }

        // update friend to add incoming
        const updateIncomingInput = {
            id: newFriend,
            incomingFriendRequests: [
                ...(await getIncomingFriendRequests(newFriend)),
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
            variables: { input: updateOutgoingInput },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })
    } else {
        return "Friend already exists or request already sent"
    }
}

export async function getOutgoingFriendRequests(userId) {
    const { data } = await API.graphql(
        graphqlOperation(getUser, { id: userId })
    );
    return data.getUser.outgoingFriendRequests;
}

export async function getIncomingFriendRequests(userId) {
    const { data } = await API.graphql(
        graphqlOperation(getUser, { id: userId })
    );
    return data.getUser.incomingFriendRequests ?? [];
}

export async function getFriendsById(userId) {
    const { data } = await API.graphql(
        graphqlOperation(getUser, { id: userId })
    );
    return data.getUser.friends;
}