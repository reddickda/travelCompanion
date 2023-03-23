import {
    Card, Flex, Button, Grid, TextField, SearchField
  } from '@aws-amplify/ui-react';

export function SearchResults({ searchResults, setShowSearchResults, setSearchResults, setLocationString, setLatLong}) {
    return (
        <div className='container-style'><div className='scrollable-div'>{searchResults.map((result, index) => {
            return <ul
                className='scrollable-ul'
                name="Location"
                onClick={() => {
                    setShowSearchResults(false)
                    setSearchResults([]);
                    setLocationString(result.address.freeformAddress);
                    setLatLong(`${result.position.lat},${result.position.lon}`)
                }}
                key={index}>
                {result.address.freeformAddress}
            </ul>

        })}
        </div>
            <Button size="small" variation='destructive' style={{ marginTop: 5 }} onClick={() => setShowSearchResults(false)}>Cancel</Button>
        </div>
        )
}