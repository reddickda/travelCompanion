import * as React from "react";
import { useState, useEffect, useRef } from "react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps';
import './Map.css'
import { css } from '@emotion/css';
import Header from './Header';
import { getRandomColor } from './utils'

const popupHtml = `
  <div class="popup">
    <h3 class="popup-title">{username}</h3>
    <p class="popup-description">{description}</p>
    <img class="popup-image" src="{imageSource}" alt="Popup Image">
    <p class="popup-location">{location}</p>
  </div>
`;

export default function Map({
  posts = [],
  updateOverlayVisibility,
  updateFriendsListVis
  }) {
    const mapElement = useRef();
    const [mapLongitude, setMapLongitude] = useState(-94)
    const [mapLatitude, setMapLatitude] = useState(34)
    const [map, setMap] = useState({});
    
    useEffect(() => {
        let map = tt.map({
          key: process.env.REACT_APP_TOMTOMAPIKEY,
          container: mapElement.current,
          center: [mapLongitude, mapLatitude],
          zoom: 3
        });

        posts.map((post, index) => {
            let lat = posts[index].latLong.split(",")[0]
            let long = posts[index].latLong.split(",")[1]
    
            setMap(map);
            
            var popupOffsets = {
              top: [0, 0],
              bottom: [0, -40],
              left: [25, -35],
              right: [-25, -35]
          }
          var currentPost = posts[index];

          const initials = `${currentPost.firstName.charAt(0)}${currentPost.lastName.charAt(0)}`;

          const locationMarker = new tt.Marker( { element: createMarkerElement(initials.toLocaleUpperCase()) })
            .setLngLat([long, lat])
            .addTo(map)
            .setPopup(new tt.Popup({ closeButton:false, offset: popupOffsets })
              .setHTML(popupHtml.replace('{username}', currentPost.username)
                .replace('{description}', currentPost.description)
                .replace('{imageSource}', currentPost.image)
                .replace('{location}', currentPost.location)))
            .togglePopup();
          }
        )
       
        return () => {
          map.remove();}
      }, [posts, mapElement]);

      useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = markerStyle;
        document.head.appendChild(style);
    
        return () => {
          document.head.removeChild(style);
        };
      }, []);

      function createMarkerElement(initials) {
        const div = document.createElement('div');
        div.style.boxShadow = '0 5px 3px rgba(0,0,0,0.7)'
        div.classList.add('custom-marker');
      
        const span = document.createElement('span');
        span.textContent = initials;
      
        div.appendChild(span);
        return div;
      }

    return (
      <>
        <div>
            <Header updateFriendsListVis={updateFriendsListVis} updateOverlayVisibility={updateOverlayVisibility}/>
            <div ref={mapElement} className={mapStyle}></div>
        </div>
     </>
    )
  }

const markerStyle = `
  .custom-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${getRandomColor()};
  }

  .custom-marker span {
    font-size: 16px;
    color: black;
  }
`;

  // min-height: calc(100vh - 45px);
const mapStyle = css`
  width: 90vw;
  height: 80vh;

  @media screen and (max-height: 650px){
    height: 60vh;
  }

  @media screen and (max-width: 500px){
    width: 100vw;
  }
`