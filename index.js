
import React, { useState } from 'react';

export default function AwningPhotoApp() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBeforeImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const generateAfterImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: beforeImage })
      });
      const data = await response.json();
      setAfterImage(data.afterImage);
    } catch (err) {
      console.error('Error generating after image', err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Awning Cleaner AI</h1>
      {!beforeImage && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </>
      )}

      {beforeImage && !afterImage && (
        <>
          <h2 className="my-4">Before Photo:</h2>
          <img src={beforeImage} className="w-80 rounded shadow mb-4" />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={generateAfterImage}
          >
            {loading ? 'Processing...' : 'Generate After Image'}
          </button>
        </>
      )}

      {afterImage && (
        <>
          <h2 className="my-4">Before:</h2>
          <img src={beforeImage} className="w-80 rounded shadow mb-4" />
          <h2 className="my-4">After:</h2>
          <img src={afterImage} className="w-80 rounded shadow mb-4" />
          <a href="sms:+16468230041" className="bg-green-600 text-white px-6 py-3 rounded text-xl">Contact Us</a>
        </>
      )}
    </div>
  );
}
