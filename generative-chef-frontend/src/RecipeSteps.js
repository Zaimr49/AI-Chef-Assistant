import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

function RecipeSteps({ steps }) {
  const [images, setImages] = useState(new Array(steps.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      if (retryCount >= 3) { // Stop retrying after 3 attempts
        console.error("Failed to fetch images after 3 attempts.");
        return;
      }

      setLoading(true);
      console.log("Attempting to fetch images, attempt:", retryCount + 1);
      try {
        const promises = steps.map(step =>
          axios.post(process.env.REACT_APP_HUGGINGFACE_MODEL_URL, {
            inputs: step
          }, {
            headers: { 'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}` },
            responseType: 'arraybuffer'
          }).then(response => {
            const base64 = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            return `data:image/jpeg;base64,${base64}`;
          })
        );
        const imageUrls = await Promise.all(promises);
        console.log("Successfully fetched images")
        console.log(imageUrls)
        setImages(imageUrls);
      } catch (error) {
        console.error('Failed to fetch images', error);
        setRetryCount(retryCount + 1); // Increment retry count and try again
      } finally {
        setLoading(false);
      }
    };

    // there are steps only then fetch images
    if (steps.length > 0)
      {
        fetchImages();
      }
  }, [steps, retryCount]); // Retry when steps change or retry count increases

  return (
    <div>
      {steps.length > 0 && <h2>Recipe Steps</h2>}
      {steps.map((step, index) => (
        <div key={index} className="card mt-3 bg-dark text-white border border-muted" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div className="card-body text-center"> {/* Added text-center */}
          <h2 className="card-title">Step {index + 1}</h2>
          <h5 className="card-text">{step}</h5>
          {loading ? (
            <>
              <p>Loading Image</p>
              <Spinner animation="border" variant="primary" />
            </>
          ) : (
            <>
              <img src={images[index] || 'placeholder-image-url'} alt={`Visualization for step ${index + 1}`} className="img-fluid mx-auto d-block" style={{ maxWidth: '350px' }} /> {/* Modified style and added classes */}
            </>
          )}
        </div>
      </div>
      
      ))}
    </div>
  );
}

export default RecipeSteps;
