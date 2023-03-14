import * as React from "react";
import { useState, useEffect, useRef } from "react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps';
import './Map.css'
import { css } from '@emotion/css';
import Header from './Header';
import Button from './Button';
import CreatePost from './CreatePost';

const MAX_ZOOM = 17;

export default function Map({posts = []
  }) {
    const mapElement = useRef();
    const [mapLongitude, setMapLongitude] = useState(-94)

    const [mapLatitude, setMapLatitude] = useState(34)

    const [mapZoom, setMapZoom] = useState(13);

    const [map, setMap] = useState({});
    const [showOverlay, updateOverlayVisibility] = useState(false);

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
            let locationMarker = new tt.Marker({}).setLngLat([long, lat]).addTo(map);
    
            var popupOffsets = {
                top: [0, 0],
                bottom: [0, -50],
                left: [25, -35],
                right: [-25, -35]
            }
            
            var popup = new tt.Popup({ offset: popupOffsets })
                .setHTML(`<div><p>${posts[index].description}<p/><p>${posts[index].location}<p/><img width="100px" height="100px" src="${posts[index].image}"/></div>`);
                locationMarker.setPopup(popup).togglePopup();
        })
       
        return () => map.remove();
      }, [posts]);

      

    //   useEffect(() => {
    //     console.log(posts)
    //     let locationMarker = new tt.Marker().setLngLat([-94, 34]).addTo(map);
    //     return () => map.remove();
    //   }, [posts]);

    const increaseZoom = () => {
        if (mapZoom < MAX_ZOOM) {
          setMapZoom(mapZoom + 1);
        }
      };
      
      const decreaseZoom = () => {
        if (mapZoom > 1) {
          setMapZoom(mapZoom - 1);
        }
      };
      
      const updateMap = () => {
        map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
        map.setZoom(mapZoom);
      };

      
    return (
      <>
        <div className={contentStyle}>
            <Header />
            
            <div ref={mapElement} className={mapStyle}></div>
        </div>
         
        </>
    )
  }

  const contentStyle = css`
`


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
