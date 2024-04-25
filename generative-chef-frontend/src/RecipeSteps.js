import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecipeSteps({ steps }) {
  const [images, setImages] = useState(new Array(steps.length).fill(null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Model URL:', process.env.REACT_APP_HUGGINGFACE_MODEL_URL);
console.log('API Key:', process.env.REACT_APP_HUGGINGFACE_API_KEY);

    const fetchImages = async () => {
      setLoading(true);
      try {
        console.log("Getting Images")
        const promises = steps.map(step =>
          axios.post(process.env.REACT_APP_HUGGINGFACE_MODEL_URL, {
            inputs: step.description
          }, {
            headers: { 'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}` },
            responseType: 'arraybuffer'  // Treat the response as binary data
          }).then(response => {
            // Convert binary data to a base64 string
            const base64 = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            return `data:image/jpeg;base64,${base64}`;  // Prepare the base64 image URL
          })
        );
        const imageUrls = await Promise.all(promises);
        console.log("Got Images")
        setImages(imageUrls);
      } catch (error) {
        console.error('Failed to fetch images', error);
      }
      setLoading(false);
    };

    if (steps.length > 0) {
      fetchImages();
    }
  }, [steps]);  // Effect runs every time 'steps' changes

  return (
    <div>
      {steps.length > 0 && <h2>Recipe Steps</h2>}
      {steps.map((step, index) => (
        <div key={index} className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Step {index + 1}</h5>
            <p className="card-text">{step}</p>
            {loading ? (
              <p>Loading image...</p>
            ) : (
                <>
              <img src={images[index] || 'placeholder-image-url'} alt={`Visualization for step ${index + 1}`} className="img-fluid" />
                </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeSteps;
