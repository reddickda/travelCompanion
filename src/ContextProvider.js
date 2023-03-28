import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function ContextProvider(props) {
    const [state, setState] = useState({
      loggedInUser: "",
      friendsUsernames: [],
      friendsData: [],
      incomingFriendRequests: [],
      outgoingFriendRequests: [],
      myPosts: [],
      myFriendsPosts: [],
      isFriendsListVisible: false,
      isCreatePostVisible: false,
      isDatePickerVisable: false
    });

    const updateLoggedInUser = (user) => {
        setState(prevState => ({ ...prevState, loggedInUser: user }));
    }

    const updateFriendsUsernames = (newUserNames) => {
        setState(prevState => ({ ...prevState, friendsUsernames: newUserNames }));
    }

    const updateFriendsData = (newFriendsData) => {
        setState(prevState => ({ ...prevState, friendsData: newFriendsData }));
    }

    const updateIncomingFriendRequests = (newIncomingFriendRequests) => {
        setState(prevState => ({ ...prevState, incomingFriendRequests: newIncomingFriendRequests }));
    }

    const updateOutgoingFriendRequests = (newOutgoingFriendRequests) => {
        setState(prevState => ({ ...prevState, outgoingFriendRequests: newOutgoingFriendRequests }));
    }

    const updateMyPosts = (newPosts) => {
        setState(prevState => ({ ...prevState, myPosts: newPosts }));
    }

    const updateMyFriendsPosts = (newFriendsPosts) => {
        setState(prevState => ({ ...prevState, myFriendsPosts: newFriendsPosts }));
    }

    const setFriendsListVisible = () => {
        setState(prevState => ({ ...prevState, isFriendsListVisible: true }));
    }

    const setFriendsListNotVisible = () => {
        setState(prevState => ({ ...prevState, isFriendsListVisible: false }));
    }

    const setCreatePostVisible = () => {
        setState(prevState => ({ ...prevState, isCreatePostVisible: true }));
    }

    const setCreatePostNotVisible = () => {
        setState(prevState => ({ ...prevState, isCreatePostVisible: false }));
    }

    const toggleDatePickerVisibility = () => {
        setState(prevState => ({ ...prevState, isDatePickerVisable: !prevState.isDatePickerVisable }));
    };

    return (
        <MyContext.Provider value={
            { 
                state, 
                updateLoggedInUser, 
                updateFriendsUsernames,
                updateFriendsData,
                updateIncomingFriendRequests,
                updateOutgoingFriendRequests,
                updateMyPosts,
                updateMyFriendsPosts,
                setFriendsListVisible,
                setFriendsListNotVisible,
                setCreatePostVisible,
                setCreatePostNotVisible,
                toggleDatePickerVisibility
                }}>
          {props.children}
        </MyContext.Provider>
      );
}

export function useMyContext() {
    return useContext(MyContext);
  }