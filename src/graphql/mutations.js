/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      name
      location
      latLong
      description
      username
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      name
      location
      latLong
      description
      username
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      name
      location
      latLong
      description
      username
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
          owner
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
          owner
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
          createdAt
          updatedAt
          owner
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
