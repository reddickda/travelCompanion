import {
    Flex,
    Heading,
    MapView,
    View,
    Text,
    Card,
    Image,
} from '@aws-amplify/ui-react'
import { useState } from 'react'
import { Marker, Popup, useMap } from "react-map-gl"
import './AwsMap.css';
import { getRandomColor } from './utils'

function MarkerWithPopup({ latitude, longitude, username, description, image, initials }) {
    const [showPopup, setShowPopup] = useState(false)
    const [growPopup, setGrowPopup] = useState(false);
    const { current: map } = useMap();

    const handleMarkerClick = ({ originalEvent }) => {
        map.flyTo({ center: [longitude, latitude], zoom: 5 })
        originalEvent.stopPropagation()
        setShowPopup(true)
    }

    return (
        <>
            <Marker
                latitude={latitude}
                longitude={longitude}
                onClick={handleMarkerClick}
            >
                <div style={{ backgroundColor: `${getRandomColor()}` }} className="circle"><h3>{initials.toLocaleUpperCase()}</h3></div>
            </Marker>
            {showPopup && (
                <Popup
                    latitude={latitude}
                    longitude={longitude}
                    offset={{ bottom: [0, -20] }}
                    closeButton={false}
                    onClose={() => { setShowPopup(false); setGrowPopup(false) }}
                    maxWidth='95%'
                    anchor='bottom'
                >
                    <Card
                        variation="elevated"
                        backgroundColor="#3b4b59"
                        padding={1}
                        maxWidth={growPopup ? 250 : 150}
                        style={{
                            boxShadow: '0px 2px 15px rgba(0, 0, 0, 1)'
                        }}
                        onClick={() => { setGrowPopup(!growPopup) }}

                    >
                        <Heading padding={2} color={'white'} level={6}>{username}</Heading>
                        <Text isTruncated="true" color={'white'}>{description}</Text>
                        <Image
                            objectFit={'fill'}
                            width={growPopup ? "250px" : 150}
                            height={growPopup ? "250px" : 150}
                            src={image}
                        />
                    </Card>
                </Popup>
            )}
        </>
    )
}

function AwsMap({ posts }) {
    console.log({posts})
    return (
        <View>
            <Flex direction={'column'} alignItems={'center'}>
                <MapView
                    initialViewState={{
                        longitude: -99.3381659,
                        latitude: 38.615686,
                        zoom: 2,
                    }}
                    style={{ width: '100%', height: '100vh' }}
                >
                    {
                        posts.map((post, index) => {
                            let lat = posts[index].latLong.split(",")[0]
                            let long = posts[index].latLong.split(",")[1]

                            var currentPost = posts[index];

                            const initials = `${currentPost.firstName.charAt(0)}${currentPost.lastName.charAt(0)}`;

                            return (
                                <MarkerWithPopup
                                    username={currentPost.username}
                                    image={currentPost.image}
                                    description={currentPost.description}
                                    longitude={long}
                                    latitude={lat}
                                    key={index}
                                    initials={initials} />)
                        })
                    }

                </MapView>
            </Flex>
        </View>
    )
}

export default AwsMap