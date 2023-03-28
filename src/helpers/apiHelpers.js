import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listPosts, getUser, postsByUsernameAndName, listUsers } from '../graphql/queries';
import { createUser, createPost } from '../graphql/mutations';

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
  };

  return await API.graphql({
    query: createUser,
    variables: { input: userInfo },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  });
}

export async function getPostsByUsername(username) {
  return await API.graphql(graphqlOperation(postsByUsernameAndName, { username: username, authMode: 'AMAZON_COGNITO_USER_POOLS' }))
}

// query MyQuery {
//   listPosts(filter: {or: {username: {eq: "test3", eq: "buttons"}}}) {
//     items {
//       username
//       id
//       lastName
//     }
//   }
// }

export async function getPostsByIds(ids) {

  const filter = {
    or: ids.map(id => ({ username: { eq: id } }))
  };

  const { data: { listPosts: { items: posts } } } = await API.graphql(graphqlOperation(listPosts, {
    filter: filter
  }));
  return posts;
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

export async function getPostsByDate(createdDate) {
  const startDate = new Date(createdDate);
  const endDate = new Date(createdDate);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  const result = await API.graphql(graphqlOperation(listPosts, {
    filter: {
      createdAt: {
        between: [startDate.toISOString(), endDate.toISOString()]
      }
    }
  }));

  return result.data.listPosts.items;
}