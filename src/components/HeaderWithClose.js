import { Heading, Grid, Flex } from '@aws-amplify/ui-react';
import { CloseButton } from './CloseButton';

export function HeaderWithClose({ textContent, onClick }) {
    return (
        <Grid templateColumns={'2fr 1fr'}>
            <Heading color='#d0d4d3' level={6}>{textContent}</Heading>
            <Flex justifyContent={'flex-end'}>
                <CloseButton onClick={onClick} />
            </Flex>
        </Grid>)
}