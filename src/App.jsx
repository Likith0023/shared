import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import FileUpload from './components/FileUpload';
import UploadButton from './components/UploadButton';
import FilesComponent from './components/FilesComponent';

const App = () => {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    setDownloadURL(url);

    await addDoc(collection(db, 'files'), {
      name: file.name,
      url: url,
    });

    setFile(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="font-bold text-red-500 text-2xl mb-4">Welcome to FreeShare</h1>

        <nav className="flex justify-between items-center bg-gray-800 text-white py-4 px-6 w-full max-w-2xl mb-8">
          <Link to="/upload" className="text-white">Upload File</Link>
          <Link to="/files" className="text-white">View Files</Link>
        </nav>

        <div className="w-full max-w-2xl">
          <Routes>
            <Route path="/upload" element={
              <div className="mt-8 flex flex-col items-center">
                <h6 className="text-lg mb-4">File Upload</h6>
                <FileUpload onFileChange={handleFileChange} />
                <div className="w-full flex justify-center mt-4">
                  <UploadButton onUpload={handleUpload} />
                </div>
                {downloadURL && (
                  <div className="mt-4 text-center">
                    <p className="text-green-500 font-bold">File uploaded successfully!</p>
                    <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download Link</a>
                  </div>
                )}
              </div>
            } />
            <Route path="/files" element={<FilesComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
