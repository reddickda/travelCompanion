/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchGetUsers = /* GraphQL */ `
  query BatchGetUsers($ids: [String]) {
    batchGetUsers(ids: $ids) {
      firstName
      lastName
      username
      email
      friends
      posts {
        items {
          id
          name
          location
          latLong
          description
          username
          image
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      incomingFriendRequests
      outgoingFriendRequests
      id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      name
      location
      latLong
      description
      username
      image
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        location
        latLong
        description
        username
        image
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const postsByUsernameAndName = /* GraphQL */ `
  query PostsByUsernameAndName(
    $username: String!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByUsernameAndName(
      username: $username
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        location
        latLong
        description
        username
        image
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      firstName
      lastName
      username
      email
      friends
      posts {
        items {
          id
          name
          location
          latLong
          description
          username
          image
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      incomingFriendRequests
      outgoingFriendRequests
      id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        firstName
        lastName
        username
        email
        friends
        posts {
          nextToken
        }
        incomingFriendRequests
        outgoingFriendRequests
        id
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
