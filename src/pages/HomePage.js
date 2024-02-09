import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LivestreamPlayer.css";
import video from "./video.mp4";
import "./OverlayOptions.css";
import Navbar from "../components/Navbar.js";

function HomePage() {
  const [overlayType, setOverlayType] = useState("text");
  const [overlayContent, setOverlayContent] = useState("");
  const [overlayPosition, setOverlayPosition] = useState(null);
  const [overlaySize, setOverlaySize] = useState(50);
  const [overlaySizeNew, setOverlaySizeNew] = useState(null);
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);
  // const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [editOverlayData, setEditOverlayData] = useState({
    id: null,
    type: null,
    content: "",
    size: 50,
    position: { x: 0, y: 0 },
  });
  useEffect(() => {
    if (videoRef.current) {
      // Set the initial position of the overlay to the top left corner
      setOverlayPosition({ x: 0, y: 0 });
    }
    // console.log("Video ref:", overlayPosition);
  }, [videoRef]);

  useEffect(() => {
    setOverlaySize(editOverlayData.size);
  }, [editOverlayData.size]);

  // Fetch overlays from the backend
const fetchOverlays = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/all");
    setOverlays(response.data);
  } catch (error) {
    console.error("Error fetching overlays:", error);
  }
};



// Fetch overlays when the component mounts
useEffect(() => {
  fetchOverlays();
}, []);
  // useEffect(() => {
  //   fetchOverlays();
  //   fetchLogos();
  // }, []);

  // const fetchOverlays = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:5000/api/overlays/all"
  //     );
  //     setOverlays(response.data);
  //   } catch (error) {
  //     console.error("Error fetching overlays:", error);
  //   }
  // };

  // const fetchLogos = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/api/logos");
  //     setLogos(response.data);
  //   } catch (error) {
  //     console.error("Error fetching logos:", error);
  //   }
  // };

  // const [deleted, setDeleted] = useState(false);

  // const deleteOverlay = async (id) => {
  //   try {
  //     const response = await fetch('/delete', {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ id: overlay.id })
  //     });

  //     if (response.ok) {
  //       setDeleted(true);
  //       const updatedOverlays = overlays.filter((overlay) => overlay.id !== id);
  //     setOverlays(updatedOverlays);
  //     } else {
  //       console.error('Failed to delete overlay');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting overlay:', error);
  //   }
  const deleteOverlay = async (id) => {
    try {
      // Make a DELETE request to the backend to delete the overlay
      const response = await axios.delete("http://127.0.0.1:5000/delete", {
        data: { id: id }, // Send the overlay ID in the request body
      });

      // Check if the delete operation was successful (status code 200)
      if (response.status === 200) {
        console.log("Overlay deleted successfully");

        // Update the local state by filtering out the deleted overlay
        const updatedOverlays = overlays.filter((overlay) => overlay.id !== id);
        setOverlays(updatedOverlays);

        // Update the overlay list in the backend
        // await fetchOverlays(); // Assuming fetchOverlays updates the local overlay list
      } else {
        console.error("Failed to delete overlay");
      }
    } catch (error) {
      console.error("Error deleting overlay:", error);
    }
  };

  const handleOverlayTypeChange = (event) => {
    setOverlayType(event.target.value);
  };

  const handleOverlayContentChange = (event) => {
    setOverlayContent(event.target.value);
  };

  const handleLogoSelection = (logo) => {
    setSelectedLogo(logo);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleEditOverlay = (overlay) => {
    setEditOverlayData({
      id: overlay.id,
      type: overlay.type,
      content: overlay.content,
      size: overlay.size,
      position: overlay.position,
    });
    setIsEditing(true);
    console.log("Edit overlay:", overlay);
  };
  const handleMouseDown = (event, overlay) => {
    if (!isEditing) return;
    setDragStart({ x: event.clientX, y: event.clientY });

    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isEditing && isDragging) {
      const videoRect = videoRef.current.getBoundingClientRect();

      const offsetX = event.clientX - dragStart.x;
      const offsetY = event.clientY - dragStart.y;

      // Calculate the new position of the overlay
      let newX = editOverlayData.position.x + offsetX;
      let newY = editOverlayData.position.y + offsetY;

      // Calculate the width and height of the overlay content
      const overlayWidth = overlaySize * 0.2 * editOverlayData.content.length;
      const overlayHeight = overlaySize * 0.2;

      // Ensure the overlay stays within the video frame
      if (newX < 0) {
        newX = 0;
      } else if (newX + overlayWidth > videoRect.right - videoRect.left) {
        newX = videoRect.right - videoRect.left - overlayWidth;
      }
      if (newY < 0) {
        newY = 0;
      } else if (newY + overlayHeight > videoRect.bottom - videoRect.top - 32) {
        newY = videoRect.bottom - videoRect.top - 32 - overlayHeight;
      }

      // Update the overlay position in the editOverlayData state
      setEditOverlayData((prevEditOverlayData) => ({
        ...prevEditOverlayData,
        position: { x: newX, y: newY },
      }));

      // Update the overlays array
      setOverlays((prevOverlays) =>
        prevOverlays.map((overlay) =>
          overlay.id === editOverlayData.id
            ? { ...overlay, position: { x: newX, y: newY } }
            : overlay
        )
      );

      // Update the drag start position
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isEditing) {
      setIsDragging(false);
    }
  };

  const toggleEditingMode = async () => {
    try {
      const videoRect = videoRef.current.getBoundingClientRect();
      let { x, y } = editOverlayData.position;
      const overlayWidth = editOverlayData.size * 0.2 * editOverlayData.content.length;
      const overlayHeight = editOverlayData.size * 0.2;
  
      // Ensure the overlay remains within the video bounds
      if (x < 0) {
        x = 0;
      } else if (x + overlayWidth > videoRect.width) {
        x = videoRect.width - overlayWidth;
      }
      if (y < 0) {
        y = 0;
      } else if (y + overlayHeight > videoRect.height) {
        y = videoRect.height - overlayHeight;
      }
  
      // Update the overlay position
      const updatedOverlayData = {
        ...editOverlayData,
        position: { x, y },
      };
  
      // Make the update overlay call
      const response = await axios.put("http://127.0.0.1:5000/update", updatedOverlayData);
      if (response.status === 200) {
        console.log("Overlay updated successfully");
  
        // Update local state to reflect changes
        const updatedOverlays = overlays.map((overlay) =>
          overlay.id === updatedOverlayData.id ? updatedOverlayData : overlay
        );
        setOverlays(updatedOverlays);
      } else {
        console.error("Failed to update overlay");
      }
  
      // Reset edit overlay data and editing mode
      setEditOverlayData({
        id: null,
        type: null,
        content: "",
        size: 50,
        position: { x: 0, y: 0 },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating overlay:", error);
    }
  };
  
  // useEffect(() => {
  //   console.log("Overlays after updating state:", overlays);
  // }, [overlays]);

  const handleDoneClick = async () => {
    try {
      const newOverlay = {
        id: Date.now(),
        type: overlayType,
        content: overlayContent,
        size: overlaySize,
        position: overlayPosition,
      };
      setOverlays([...overlays, newOverlay]);
      await axios.post("http://127.0.0.1:5000/api/overlays/create", newOverlay);
      setOverlayType("text");
      setOverlayContent("");
    } catch (error) {
      console.error("Error adding overlay:", error);
    }
  };
  // console.log("Current Overlays:", overlays);

  return (
    <div
      className="home-page-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="livestream-player-container">
        <div className="livestream-player">
          <video
            className="livestream-video"
            ref={videoRef}
            onClick={togglePlayPause}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div>
            {overlays.map((overlay, index) => (
              <div
                key={overlay.id}
                style={{
                  position: "absolute",
                  top: `${overlay.position.y}px`,
                  left: `${overlay.position.x}px`,
                  width: `${0}%`,
                  height: `${0}%`,
                  zIndex: index + 1,
                  // pointerEvents: isEditing ? "auto" : "none",
                }}
                // ref={overlayRef}

                onMouseDown={(event) => handleMouseDown(event, overlay)}
              >
                {overlay.type === "text" && (
                  <div
                    style={{
                      fontSize: `${overlay.size * 0.02}rem`,
                    }}
                  >
                    {overlay.content}
                  </div>
                )}

                {overlay.type === "logo" && (
                  <img
                    src={overlay.content}
                    alt={`Logo ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="controls-container" style={{ marginTop: "10px" }}>
          <div className="overlay-control">
            <button className="overlay-button" onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
          <div className="overlay-control">
            <label className="overlay-label">
              Volume:
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </label>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="overlay-edit-form">
          <h2>Edit Overlay</h2>
          <label>Content:</label>
          <input
            type="text"
            value={editOverlayData.content}
            onChange={(e) =>
              setEditOverlayData({
                ...editOverlayData,
                content: e.target.value,
              })
            }
          />
        </div>
      )}

      {isEditing && (
        <div className="overlay-control">
          <label className="overlay-label">
            Overlay Size:
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={editOverlayData.size}
              onChange={(e) =>
                setEditOverlayData(
                  {
                    ...editOverlayData,
                    size: parseInt(e.target.value),
                  }
                  // setOverlaySizeNew(parseInt(e.target.value))
                )
              }
            />
          </label>
        </div>
      )}
      {isEditing && (
        <div className="overlay-control">
          <button className="overlay-button" onClick={toggleEditingMode}>
            Done
          </button>
        </div>
      )}

      <div
        className="overlay-list-container"
        style={{
          width: "400px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <h2>Overlay List</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {overlays.map((overlay, index) => (
            <li key={overlay.id} style={{ marginBottom: "8px" }}>
              <span>{index + 1}. </span>
              <span>{overlay.content}</span>
              <button onClick={() => handleEditOverlay(overlay)}>Edit</button>
              <button onClick={() => deleteOverlay(overlay.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="overlay-options-container">
        <h2 className="overlay-heading">Overlay Options</h2>
        <div className="overlay-control">
          <label className="overlay-label">
            Overlay Type:
            <select
              className="overlay-select"
              value={overlayType}
              onChange={handleOverlayTypeChange}
            >
              {/* <option value="logo">Logo</option> */}
              <option value="text">Text</option>
            </select>
          </label>
        </div>
        <div className="overlay-control">
          {overlayType === "text" ? (
            <label className="overlay-label">
              Overlay Content:
              <input
                type="text"
                className="overlay-input"
                placeholder="Enter overlay content here..."
                value={overlayContent}
                onChange={handleOverlayContentChange}
              />
            </label>
          ) : (
            <div className="logo-selection">
              <label className="overlay-label">Select a Logo:</label>
              <div className="logo-list">
                {logos.map((logo) => (
                  <img
                    key={logo.id}
                    src={logo.url}
                    alt={logo.alt}
                    className={selectedLogo === logo ? "selected-logo" : "logo"}
                    onClick={() => handleLogoSelection(logo)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="overlay-control">
          <button className="overlay-button" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
