import { Card } from '@aws-amplify/ui-react';
import './OverlayModal.css'

export const OverlayModal = (props) => {

    return (
        <div style={{backgroundColor: `${props.backgroundColor}`}} className="overlay">
            <Card padding={5} variation={"elevated"} className="container-style">
                {props.children}
            </Card>
        </div>
    )
}