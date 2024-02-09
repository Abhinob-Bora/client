// import React, { useState,useEffect } from "react";
// import axios from 'axios';
// import "./OverlayOptions.css";

// function OverlayOptions() {
//   // State for overlay customization
//   const [overlayType, setOverlayType] = useState("logo"); // Default to 'logo'
//   const [overlayContent, setOverlayContent] = useState("");
//   const [overlayPosition, setOverlayPosition] = useState("top-left"); // Default to 'top-left'
//   const [overlaySize, setOverlaySize] = useState("medium"); // Default to 'medium'
//   const [logos, setLogos] = useState([]);
//   const [selectedLogo, setSelectedLogo] = useState(null);
//   // Function to handle overlay type change
//   const handleOverlayTypeChange = (event) => {
//     setOverlayType(event.target.value);
//   };
  
//   useEffect(() => {
//     fetchLogos();
//   }, []);

//   const fetchLogos = async () => {
//     try {
//       const response = await axios.get('/api/logos');
//       setLogos(response.data);
//     } catch (error) {
//       console.error('Error fetching logos:', error);
//     }
//   };

//   // Function to handle overlay content change
//   const handleOverlayContentChange = (event) => {
//     setOverlayContent(event.target.value);
//   };
//   const handleLogoSelection = (logo) => {
//     setSelectedLogo(logo);
//   };
//   // Function to handle overlay position change
//   const handleOverlayPositionChange = (event) => {
//     setOverlayPosition(event.target.value);
//   };

//   // Function to handle overlay size change
//   const handleOverlaySizeChange = (event) => {
//     setOverlaySize(event.target.value);
//   };

//   return (
//     <div className="overlay-options-container">
//       <h2 className="overlay-heading">Overlay Options</h2>
//       <div className="overlay-control">
//         <label className="overlay-label">
//           Overlay Type:
//           <select
//             className="overlay-select"
//             value={overlayType}
//             onChange={handleOverlayTypeChange}
//           >
//             <option value="logo">Logo</option>
//             <option value="text">Text</option>
//           </select>
//         </label>
//       </div>
//       <div className="overlay-control">
//         {overlayType === "text" ? (
//           <label className="overlay-label">
//             Overlay Content:
//             <input
//               type="text"
//               className="overlay-input"
//               placeholder="Enter overlay content here..."
//               value={overlayContent}
//               onChange={handleOverlayContentChange}
//             />
//           </label>
//         ) : (
//           <div className="logo-selection">
//           <label className="overlay-label">Select a Logo:</label>
//           <div className="logo-list">
//             {logos.map((logo) => (
//               <img
//                 key={logo.id}
//                 src={logo.url}
//                 alt={logo.alt}
//                 className={selectedLogo === logo ? 'selected-logo' : 'logo'}
//                 onClick={() => handleLogoSelection(logo)}
//               />
//             ))}
//           </div>
//         </div>
//         )}
//       </div>

//       <div className="overlay-control">
//         <label className="overlay-label">
//           Overlay Position:
//           <select
//             className="overlay-select"
//             value={overlayPosition}
//             onChange={handleOverlayPositionChange}
//           >
//             <option value="top-left">Top Left</option>
//             <option value="top-right">Top Right</option>
//             <option value="bottom-left">Bottom Left</option>
//             <option value="bottom-right">Bottom Right</option>
//           </select>
//         </label>
//       </div>
//       <div className="overlay-control">
//         <label className="overlay-label">
//           Overlay Size:
//           <select
//             className="overlay-select"
//             value={overlaySize}
//             onChange={handleOverlaySizeChange}
//           >
//             <option value="small">Small</option>
//             <option value="medium">Medium</option>
//             <option value="large">Large</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// }

// export default OverlayOptions;
