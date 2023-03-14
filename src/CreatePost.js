import React, { useState } from 'react';
import { css } from '@emotion/css';
import Button from './Button';
import { v4 as uuid } from 'uuid';
import { Storage, API, Auth } from 'aws-amplify';
import { createPost } from './graphql/mutations';
import axios from 'axios';
import { results } from './mockresponse';

/* Initial state to hold form input, saving state */
const initialState = {
  name: '',
  description: '',
  image: {},
  file: '',
  location: '',
  saving: false
};

export default function CreatePost({
  updateOverlayVisibility, updatePosts, posts
}) {
  /* 1. Create local state with useState hook */
  const [formState, updateFormState] = useState(initialState)
  const [searchResults, setSearchResults] = useState([]);
  const [locationString, setLocationString] = useState("");
  const [latLong, setLatLong] = useState("");


  async function getPlaces(query, lat, long, limit = 3, radius = 10000) {

    let baseUrl = 'https://api.tomtom.com/search/2/search/';

    let queryString = `limit=${limit}&radius=${radius}&key=${process.env.REACT_APP_TOMTOMAPIKEY}`;

    let sanitizedQuery = query.replace(
        /[^a-zA-Z\s]/g,
        ""
      )

    let response = await axios.get(`${baseUrl}/${sanitizedQuery}.json?${queryString}`);

    return response.data.results;

    // return results.results;
}

// TODO make a search bar with an enter button and only fire request then - limit to 5 results and they can choose
// prevent bombing the search button
  async function search(query) {
    if (query.length > 0) {

      let results = (await getPlaces(query));
      setSearchResults(results);
    }
  }

  /* 2. onChangeText handler updates the form state when a user types into a form field */
  function onChangeText(e) {
    e.persist();

    let sanitizedText = e.target.value.replace(
        /[^a-zA-Z\s]/g,
        ""
      )

    updateFormState(currentState => ({ ...currentState, [e.target.name]: sanitizedText }));
  }

  /* 3. onChangeFile handler will be fired when a user uploads a file  */
  function onChangeFile(e) {
    e.persist();
    var fileName = e.target.files[0].name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

    if (!e.target.files[0]) return; //|| extFile!="jpg" || extFile!="jpeg" || extFile!="png"
    const image = { fileInfo: e.target.files[0], name: `${e.target.files[0].name}_${uuid()}`}
    updateFormState(currentState => ({ ...currentState, file: URL.createObjectURL(e.target.files[0]), image }))
  }

  /* 4. Save the post  */
  async function save() {
    try {
      updateOverlayVisibility(false);

      const { name, description, image } = formState;

      if (!name || !description || !locationString || !latLong || !image.name) return;

      updateFormState(currentState => ({ ...currentState, saving: true }));
      const postId = uuid();
      const postInfo = { name, description, latLong, location: locationString, image: formState.image.name, id: postId };
  
      await Storage.put(formState.image.name, formState.image.fileInfo);
      await API.graphql({
        query: createPost,
        variables: { input: postInfo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      }); // updated
      const { username } = await Auth.currentAuthenticatedUser(); // new
      updatePosts([...posts, { ...postInfo, image: formState.file, owner: username }]); // updated
      updateFormState(currentState => ({ ...currentState, saving: false }));
      updateOverlayVisibility(false);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  const Input = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        search(event.target.value)
      }
    }
  
    return <input type="text" onKeyDown={handleKeyDown} placeholder={locationString ?? "Location - type search and press enter"} />
  }

  return (
    <div className={containerStyle}>
      <input
        placeholder="Post name"
        name="name"
        className={inputStyle}
        onChange={onChangeText}
      />
      <Input />
      <div>
          {searchResults.map((result, index) => {
            return <ul name="Location" onClick={() =>{setSearchResults([]); setLocationString(result.address.freeformAddress); setLatLong(`${result.position.lat},${result.position.lon}`)}} key={index}>{result.address.freeformAddress}</ul>
          })}
      </div>
      <input
        placeholder="Description"
        name="description"
        className={inputStyle}
        onChange={onChangeText}
      />
      <input 
        type="file"
        onChange={onChangeFile}
        accept="image/*"
      />
      { formState.file && <img className={imageStyle} alt="preview" src={formState.file} /> }
      <Button title="Create New Post" onClick={save} />
      <Button type="cancel" title="Cancel" onClick={() => updateOverlayVisibility(false)} />
      { formState.saving && <p className={savingMessageStyle}>Saving post...</p> }
    </div>
  )
}

const inputStyle = css`
  margin-bottom: 10px;
  outline: none;
  padding: 7px;
  border: 1px solid #ddd;
  font-size: 16px;
  border-radius: 4px;
`

const imageStyle = css`
  height: 120px;
  margin: 10px 0px;
  object-fit: contain;
`

const containerStyle = css`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 420px;
  position: fixed;
  left: 0;
  border-radius: 4px;
  top: 0;
  margin-left: calc(50vw - 220px);
  margin-top: calc(50vh - 230px);
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.125rem 0.25rem;
  padding: 20px;
`

const savingMessageStyle = css`
  margin-bottom: 0px;
`