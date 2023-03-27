import React from "react";
import { Button, Grid, Card, Flex } from "@aws-amplify/ui-react"
import { Link } from 'react-router-dom'
import './Header.css';
import { AiOutlinePlus} from "react-icons/ai"

export default function Footer({ updateOverlayVisibility }) {
    // const [buttonBottom, setButtonBottom] = useState(20);
    // const [scrollDir, setScrollDir] = useState("scrolling down");

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
        <Card style={{ borderRadius: 0, backgroundColor: '#3f4343', position: 'fixed', left: 0, right: 0, margin: 'auto', bottom: 0, zIndex: 999 }}>
            <Grid height={60} justifyContent={'center'} alignItems={'center'} columnGap="0.5rem" templateColumns={"1fr 1fr 1fr"}>
                <Flex justifyContent={'flex-start'} paddingLeft={10}>
                    <Button height={40} size="small"><Link style={linkStyle} to="/">Friends Posts</Link></Button>
                </Flex>
                <Flex justifyContent={'center'}>
                    <Button height={40} onClick={() => updateOverlayVisibility(true)}><AiOutlinePlus color="#bcbec2" /></Button>
                </Flex>
                <Flex justifyContent={'flex-end'} paddingRight={10}>
                    <Button height={40} size="small"><Link style={linkStyle} to="/myPosts">My Posts</Link></Button>
                </Flex>
            </Grid>
        </Card>

    )

}

const linkStyle = { textDecoration: 'none', color: '#bcbec2', fontSize: "12px" }
// style={{ position: 'fixed', left: 0, right: 0, margin: 'auto', bottom: 0, zIndex: 999 }}