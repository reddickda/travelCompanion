import { API, Storage, Auth, graphqlOperation } from 'aws-amplify';
import { listPosts, getUser, postsByUsernameAndName, listUsers } from './graphql/queries';
import { createUser, updateUser, createPost } from './graphql/mutations';

export async function getAllPosts() {
  return await API.graphql({ query: listPosts, variables: { limit: 100 } });
}

export async function getAllUsers() {
  return await API.graphql({ query: listUsers, variables: { limit: 100 } });
}

export async function getCurrentApiUser(username) {
  return await API.graphql({ query: getUser, variables: { username: username, id: username } });
}

export async function createApiUser(currentAuthenticatedUser) {
  const userInfo = {
    firstName: currentAuthenticatedUser.attributes.given_name,
    lastName: currentAuthenticatedUser.attributes.family_name,
    username: currentAuthenticatedUser.username,
    email: currentAuthenticatedUser.attributes.email.toLowerCase(),
    id: currentAuthenticatedUser.username,
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: []
  }; //id: uuidv4()

  return await API.graphql({
    query: createUser,
    variables: { input: userInfo },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  });
}

export async function updateUserFriends(userId, listOfFriends, newFriend) {
  // mutation update {
  //     updateUser(input: {id: "buttons", firstName: "farts"}, condition: {username: {eq: "buttons"}}) {
  //       id
  //       firstName
  //     }
  //   }

  const updateInput = {
    id: userId,
    friends: [listOfFriends],
    filter: {
      username: {
        eq: userId
      }
    }
  }

  return await API.graphql({
    query: updateUser,
    variables: { input: updateInput },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  })
}

export async function updateUserOutgoingFriends(userId, newFriend) {
  let currentFriends = await getFriends(userId);
  let currentFriendRequests = await getOutgoingFriendRequests(userId) ?? [];

  if (!currentFriends.includes(newFriend) && !currentFriendRequests.includes(newFriend)) {

    const updateInput = {
      id: userId,
      outgoingFriendRequests: [
        ...currentFriendRequests,
        newFriend
      ]
    }

    async function getIncomingFriendRequests(newFriend){
      const { data } = await API.graphql(
        graphqlOperation(getUser, { id: newFriend })
      );
      return data.getUser.incomingFriendRequests ?? [];
    }

    const updateIncomingInput = {
      id: newFriend,
      incomingFriendRequests: [
        ...(await getIncomingFriendRequests(newFriend)),
        userId
      ]
    }
    
    await API.graphql({
      query: updateUser,
      variables: { input: updateIncomingInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })

    return await API.graphql({
      query: updateUser,
      variables: { input: updateInput },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    })
  } else {
    return "Friend already exists or request already sent"
  }
}

async function getOutgoingFriendRequests(userId) {
  const { data } = await API.graphql(
    graphqlOperation(getUser, { id: userId })
  );
  return data.getUser.outgoingFriendRequests;
}

async function getFriends(userId) {
  const { data } = await API.graphql(
    graphqlOperation(getUser, { id: userId })
  );
  return data.getUser.friends;
}

export async function getPostsByUsername(username) {
  return await API.graphql(graphqlOperation(postsByUsernameAndName, { username: username, authMode: 'AMAZON_COGNITO_USER_POOLS' }))
}

export async function createApiPost(postInfo, formState) {

  await Storage.put(formState.image.name, formState.image.fileInfo);
  await API.graphql({
    query: createPost,
    variables: { input: postInfo },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  });
}

export async function getPostsLastDay() {
  const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString();
  const oneWeekAgo = new Date(Date.now() - 604800000).toISOString();
  const listInput = {
    filter: {
      createdAt: {
        ge: oneWeekAgo
      }
    }
  }

  return await API.graphql({
    query: listPosts,
    variables: { input: listInput },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  })
}