import React from 'react';

const FileUpload = ({ onFileChange }) => {
  return (
    <div className="w-full flex justify-center">
      <input
        type="file"
        onChange={(e) => onFileChange(e.target.files[0])}
        className="mb-4"
      />
    </div>
  );
};

export default FileUpload;
