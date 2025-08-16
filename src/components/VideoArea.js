import React from "react";
import { FaPlayCircle, FaLock } from "react-icons/fa";

const VideoArea = ({ selectedVideo, hasPaid, isLoggedIn, handleBuy }) => {
  if (!selectedVideo) {
    return (
      <div className="flex-1 flex justify-center items-start p-4 text-gray-600 text-sm">
        Select a video to start learning
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center items-start p-4">
      {hasPaid ? (
        <div className="w-full max-w-3xl">
          <video
            src={selectedVideo.cloudinaryUrl}
            controls
            controlsList="nodownload noremoteplayback noplaybackrate"
            disablePictureInPicture
            className="w-full rounded-md shadow select-none pointer-events-auto"
            style={{ maxHeight: "360px", objectFit: "contain" }}
            onContextMenu={(e) => e.preventDefault()} // disable right-click / long press
          />
          <h2 className="text-gray-900 font-semibold text-base mt-3">
            {selectedVideo.title}
          </h2>
          <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white rounded shadow p-4 text-center">
          <img
            src={selectedVideo.preview}
            alt={selectedVideo.title}
            className="w-full h-40 object-cover rounded select-none pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
          />
          <FaLock className="text-gray-500 text-3xl my-3 mx-auto" />
          <p className="text-gray-600 text-sm">Purchase to unlock this video</p>
          {isLoggedIn ? (
            <button
              onClick={handleBuy}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              <FaPlayCircle className="inline mr-1" /> Buy Now ₹{selectedVideo.price}
            </button>
          ) : (
            <p className="text-gray-500 text-xs mt-2">
              Please login to purchase or watch full video.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoArea;