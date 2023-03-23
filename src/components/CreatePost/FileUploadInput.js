export function FileUploadInput({ fileInputDiv, onChangeFile, fileUploaded}) {

    return(<><div style={fileInputDiv}>
        <input
          style={{ display: 'none' }}
          id="img"
          type="file"
          onChange={onChangeFile}
          accept="image/*"
        />
        <label style={{ color: 'white' }} for="img"><b>Upload Image</b></label>
      </div>
      {fileUploaded && <div>Upload Success</div>}
      </>)
}