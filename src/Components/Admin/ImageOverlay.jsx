import React from 'react';

const ImageOverlay = ({ imageUrl, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative">
                {/* Tombol Close */}
                <button 
                    className="absolute top-0 right-0 m-2 text-red-600 btn btn-circle" 
                    onClick={onClose}>
                    ✕
                </button>

                {/* Gambar Overlay */}
                <div className="max-w-md p-4 bg-white rounded-lg shadow-lg">
                    <img src={imageUrl} alt="Overlay" className="w-full h-auto rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default ImageOverlay;
