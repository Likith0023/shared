import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import sgMail from '@sendgrid/mail'; // Import SendGrid library

// Set your SendGrid API Key
sgMail.setApiKey('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');

const FilesComponent = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const uploadsRef = ref(storage, 'uploads');
        const fileList = await listAll(uploadsRef);
        const fileUrls = await Promise.all(fileList.items.map(async (item) => {
          return { name: item.name, url: await getDownloadURL(item) };
        }));
        setFiles(fileUrls);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const sendEmail = async (toEmail, fileUrl) => {
    const msg = {
      to: toEmail,
      from: 'shivulikith0023@gmail.com', // Set sender email
      subject: 'File Shared with You',
      text: `You have been shared a file: ${fileUrl}`,
      html: `<p>You have been shared a file: <a href="${fileUrl}">${fileUrl}</a></p>`,
    };

    try {
      await sgMail.send(msg);
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Error sending email. Please try again later.');
    }
  };

  const handleShare = async (url) => {
    if (email === '') {
      setError('Please enter an email address.');
      return;
    }

    try {
      await sendEmail(email, url);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <ul>
        {files.map((file, index) => (
          <li key={index} className="flex items-center justify-between border-b py-2">
            <div className="flex items-center">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{file.name}</a>
              <input
                type="text"
                className="ml-4 px-2 py-1 border rounded-md w-1/2"
                placeholder="Enter email"
                onChange={handleEmailChange}
              />
            </div>
            <button onClick={() => handleShare(file.url)} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md">
              Share
            </button>
          </li>
        ))}
      </ul>
      {emailSent && <p className="text-green-500">Email sent successfully!</p>}
    </div>
  );
};

export default FilesComponent;
