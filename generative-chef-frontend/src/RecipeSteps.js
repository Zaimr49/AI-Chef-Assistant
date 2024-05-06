// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Spinner } from 'react-bootstrap';

// function RecipeSteps({ steps }) {
//   const [images, setImages] = useState(new Array(steps.length).fill(null));
//   const [loading, setLoading] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     const fetchImages = async () => {
//       if (retryCount >= 3) { // Stop retrying after 3 attempts
//         console.error("Failed to fetch images after 3 attempts.");
//         return;
//       }

//       setLoading(true);
//       console.log("Attempting to fetch images, attempt:", retryCount + 1);
//       try {
//         const promises = steps.map(step =>
//           axios.post(process.env.REACT_APP_HUGGINGFACE_MODEL_URL, {
//             inputs: step
//           }, {
//             headers: { 'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}` },
//             responseType: 'arraybuffer'
//           }).then(response => {
//             const base64 = btoa(
//               new Uint8Array(response.data).reduce(
//                 (data, byte) => data + String.fromCharCode(byte),
//                 ''
//               )
//             );
//             return `data:image/jpeg;base64,${base64}`;
//           })
//         );
//         const imageUrls = await Promise.all(promises);
//         console.log("Successfully fetched images")
//         console.log(imageUrls)
//         setImages(imageUrls);
//       } catch (error) {
//         console.error('Failed to fetch images', error);
//         setRetryCount(retryCount + 1); // Increment retry count and try again
//       } finally {
//         setLoading(false);
//       }
//     };

//     // there are steps only then fetch images
//     if (steps.length > 0)
//       {
//         fetchImages();
//       }
//   }, [steps, retryCount]); // Retry when steps change or retry count increases

//   return (
//     <div>
//       {steps.length > 0 && <h2>Recipe Steps</h2>}
//       {steps.map((step, index) => (
//         <div key={index} className="card mt-3 bg-dark text-white border border-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
//           <div className="card-body">
//             <h5 className="card-title">Step {index + 1}</h5>
//             <p className="card-text">{step}</p>
//             {loading ? (
//               <>
//               <p>Loading Image</p>
//               <Spinner animation="border" variant="primary" />
//               </>
//             ) : (
//               <>
//                 <img src={images[index] || 'placeholder-image-url'} alt={`Visualization for step ${index + 1}`} className="img-fluid" />
//               </>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RecipeSteps;

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

  // Split the steps into two columns
  const numSteps = steps.length;
  const midIndex = Math.ceil(numSteps / 2);
  const firstColumnSteps = steps.slice(0, midIndex);
  const secondColumnSteps = steps.slice(midIndex);

  return (
    <div className="row">
      <div className="col">
        {firstColumnSteps.map((step, index) => (
          <div key={index} className="card mt-3 bg-dark text-white border border-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body">
              <h5 className="card-title">Step {index + 1}</h5>
              <p className="card-text">{step}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="col">
        {secondColumnSteps.map((step, index) => (
          <div key={index} className="card mt-3 bg-dark text-white border border-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body">
              <h5 className="card-title">Step {midIndex + index + 1}</h5>
              <p className="card-text">{step}</p>
              {loading ? (
                <>
                  <p>Loading Image</p>
                  <Spinner animation="border" variant="primary" />
                </>
              ) : (
                <>
                  <img src={images[midIndex + index] || 'placeholder-image-url'} alt={`Visualization for step ${midIndex + index + 1}`} className="img-fluid" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeSteps;
