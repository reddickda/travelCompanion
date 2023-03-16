/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
