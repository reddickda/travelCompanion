import { Heading, Grid } from '@aws-amplify/ui-react';
import { CloseButton } from './CloseButton';

export function HeaderWithClose({ textContent, onClick }) {
    return (
        <Grid templateColumns={'1fr 1fr'}>
            <Heading color='#d0d4d3' width='30vw' level={6}>{textContent}</Heading>
            <CloseButton onClick={onClick} />
        </Grid>)
}