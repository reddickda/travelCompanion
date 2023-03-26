import {
    Flex,
    Heading,
    MapView,
    View,
    Text,
    Card,
    Image,
    useTheme,
    Theme
} from '@aws-amplify/ui-react'
import { Marker, Popup } from "react-map-gl"

export function PopupCard() {

    return(<Popup
        latitude={latitude}
        longitude={longitude}
        offset={{ bottom: [0, -20] }}
        onClose={() => setShowPopup(false)}
        maxWidth='95%'
        anchor='bottom'
    >
        <Card
            variation="elevated"
            backgroundColor="#3b4b59"
            padding={0}
            maxWidth={150}
            style={{
                boxShadow: '0px 2px 15px rgba(0, 0, 0, 1)'
            }}
            onClick={() => console.log('clicked')}
        >
            <Heading padding={5} color={'white'} level={5}>{username}</Heading>
            <Text style={{overflowX:'scroll'}} color={'white'}>{description}ajklsdkasjdhashjkdhafghajkdhkasjdhkjasdhkasdjkasdhjsdhjkashd</Text>
            {/* <Flex justifyContent={'center'}> */}
                <Image
                    objectFit={'fill'}
                    width="150px"
                    height="150px"
                    src={image}
                />
            {/* </Flex> */}
        </Card>
    </Popup>)
}