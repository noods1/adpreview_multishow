import React, { useState, useRef, useEffect } from 'react';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';
import image4 from '../assets/images/image4.png';
import image5 from '../assets/images/image5.png';
import image6 from '../assets/images/image6.png';
import checkIcon from '../assets/createads/check-icon.svg';

export const videoOptions = [
  { id: 1, name: 'image1', image: image1 },
  { id: 2, name: 'image2', image: image2 },
  { id: 3, name: 'image3', image: image3 },
  { id: 4, name: 'image4', image: image4 },
  { id: 5, name: 'image5', image: image5 },
  { id: 6, name: 'image6', image: image6 },
];

function VideoSelectPopover({ value, onChange, onSelectionChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([1, 2, 3, 4]); // Default selected
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const filteredVideos = videoOptions.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVideo = (videoId) => {
    setSelectedVideos((prev) => {
      const newSelection = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      // Call onChange if provided
      if (onChange) {
        onChange({ target: { value: `${newSelection.length} videos selected` } });
      }
      // Call onSelectionChange with the selected video IDs
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
      return newSelection;
    });
  };

  // Expose selectedVideos via useEffect for initial render
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedVideos);
    }
  }, []); // Only on mount to set initial state

  const selectedCount = selectedVideos.length;
  const displayText = selectedCount > 0 ? `${selectedCount} videos selected` : 'Select videos';

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-[#d3d4d5] border-solid h-9 items-center pl-2 pr-8 py-1 relative w-full rounded font-tiktok-text font-normal text-sm text-[#404142] tracking-[0.0938px] focus:outline-none focus:ring-2 focus:ring-[#009995] focus:border-[#009995] text-left flex justify-between items-center"
      >
        <span>{displayText}</span>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[#6d6e70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#d3d4d5] z-50 w-full max-h-[400px] overflow-hidden"
          style={{ boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)' }}
        >
          {/* Search bar */}
          <div className="p-2 border-b border-[#d3d4d5]">
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#6d6e70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-[#f8f8f9] border border-[#d3d4d5] rounded text-sm font-tiktok-text text-[#404142] focus:outline-none focus:ring-2 focus:ring-[#009995] focus:border-[#009995]"
              />
            </div>
          </div>

          {/* Video list */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredVideos.map((video) => {
              const isSelected = selectedVideos.includes(video.id);
              const isMaxSelected = selectedVideos.length >= 4;
              const isDisabled = isMaxSelected && !isSelected;
              return (
                <div
                  key={video.id}
                  onClick={() => !isDisabled && handleToggleVideo(video.id)}
                  className={`flex items-center gap-2 px-3 py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f8f8f9] cursor-pointer'}`}
                >
                  {/* Checkbox */}
                  <div className={`flex items-center justify-center w-4 h-4 rounded shrink-0 ${isSelected ? '' : 'border-2 border-[#d3d4d5]'}`} style={{ backgroundColor: isSelected ? '#009995' : 'white' }}>
                    {isSelected && (
                      <img src={checkIcon} alt="check" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
                    )}
                  </div>
                  {/* Thumbnail */}
                  <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                    <img src={video.image} alt={video.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Text */}
                  <span className="font-tiktok-text font-normal text-sm text-[#121212] leading-5">{video.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoSelectPopover;
