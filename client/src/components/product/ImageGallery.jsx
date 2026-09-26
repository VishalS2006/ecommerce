import React, { useState } from 'react';

export const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  const activeImage = images[selectedImage] || images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${activeImage})`,
      backgroundSize: '220%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[500px] shrink-0 scrollbar-none py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition-all ${
                selectedImage === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200/80 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image with Zoom container */}
      <div
        className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-soft cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={activeImage}
          alt="Product Main View"
          className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-150"
        />

        {/* Zoom layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={zoomStyle}
        />

        {/* Mobile / touch hint */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/60 backdrop-blur-xs text-white text-[10px] rounded-md pointer-events-none font-medium opacity-75">
          Hover to zoom
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
