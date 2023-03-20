import React, { useState } from 'react';
import { css } from '@emotion/css';
import { v4 as uuid } from 'uuid';
import { Auth } from 'aws-amplify';
import { getPlaces } from './utils';
import { createApiPost, getCurrentApiUser } from './apiHelpers';
import './CreatePost.css'

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
  const [showSearchResults, setShowSearchResults] = useState(false)

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
    const image = { fileInfo: e.target.files[0], name: `${e.target.files[0].name}_${uuid()}` }
    updateFormState(currentState => ({ ...currentState, file: URL.createObjectURL(e.target.files[0]), image }))
  }

  /* 4. Save the post  */
  async function save() {
    try {
      const { name, description, image } = formState;
      const { username } = await Auth.currentAuthenticatedUser(); // new

      let userFromApi = await getCurrentApiUser(username);

      let userInfo = userFromApi.data.getUser;

      if (!name || !description || !locationString || !latLong || !image.name || !userInfo) return;

      updateFormState(currentState => ({ ...currentState, saving: true }));
      const postId = uuid();

      const postInfo = {
        name,
        description,
        latLong,
        location: locationString,
        image: formState.image.name,
        id: postId,
        username,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
      };

      await createApiPost(postInfo, formState);

      updatePosts([...posts, { ...postInfo, image: formState.file, owner: username }]); // updated
      updateFormState(currentState => ({ ...currentState, saving: false }));
      updateOverlayVisibility(false);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  const LocationSearch = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        search(event.target.value)
        setShowSearchResults(true)
      }
    }

    return <input className="input-style" type="text" onKeyDown={handleKeyDown} placeholder={locationString.length === 0 ? "Search Location" : locationString} />
  }

  return (
    <>
      <div className="container-style">
        <input
          placeholder="Post name"
          name="name"
          className="input-style"
          onChange={onChangeText}
        />
        <LocationSearch />
        <input
          placeholder="Description"
          name="description"
          className="input-style"
          onChange={onChangeText}
          maxLength="50"
        />
        <input
          type="file"
          onChange={onChangeFile}
          accept="image/*"
        />
        {/* { formState.file && <img className={imageStyle} alt="preview" src={formState.file} /> } */}
        <button onClick={save}>Create New Post</button>
        <button onClick={() => updateOverlayVisibility(false)}>Cancel</button>
        {formState.saving && <p className={savingMessageStyle}>Saving post...</p>}
      </div>
      {showSearchResults && <><div className="overlay"><div className='search-results-style'><div className='scrollable-div'>{searchResults.map((result, index) => {
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
        <button style={{ backgroundColor: "", marginTop: 5 }} onClick={() => setShowSearchResults(false)}>Cancel</button>
      </div></div></>}
    </>
  )
}

const savingMessageStyle = css`
  margin-bottom: 0px;
`