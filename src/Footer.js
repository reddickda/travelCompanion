import React, { useState } from "react";
import { Button } from "@aws-amplify/ui-react"
import './Header.css';

export default function Footer({ updateOverlayVisibility, updateFriendsListVis }) {
    const [buttonBottom, setButtonBottom] = useState(20);
    const [scrollDir, setScrollDir] = useState("scrolling down");

    // var bottomMenu = document.querySelector('.bottom-button');
    // var searchBar = document.querySelector('.search-bar');

    // // Get the offset position of the search bar
    // var searchBarOffset = searchBar.offsetTop;

    // // Add a scroll event listener to the window
    // window.addEventListener('scroll', function () {
    //     // Check if the user has scrolled past the search bar
    //     if (window.pageYOffset > searchBarOffset) {
    //         // Add a class to the navigation bar to make it snap above the search bar
    //         bottomMenu.classList.add('fixed-above-search');
    //     } else {
    //         // Remove the class if the user scrolls back up
    //         bottomMenu.classList.remove('fixed-above-search');
    //     }
    // });

    return (
        // <Button variation="primary" style={{bottom: 200, left:50, boxShadow:'0 5px 3px rgba(0,0,0,0.7)', position:'absolute'}} onClick={() => updateOverlayVisibility(true)}>New Post</Button>
        // <Button className="bottom-button" variation="primary" onClick={() => updateOverlayVisibility(true)}>New Post</Button>
        <Button style={{position: 'fixed', left:'10px', bottom:'60px', zIndex: 999}} variation="primary" onClick={() => updateOverlayVisibility(true)}>New Post</Button>

    )

}