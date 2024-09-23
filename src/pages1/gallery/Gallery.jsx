import React, { useState } from 'react';
import './gallery.scss'; // Assuming you named your CSS file as gallery.scss

// Importing the Seputar Diskominfo images
import gallery1 from './../../images/gallery1.jpg';
import gallery2 from './../../images/gallery2.jpg';
import gallery3 from './../../images/gallery3.jpg';
import gallery4 from './../../images/gallery4.jpg';
import gallery5 from './../../images/gallery5.jpg';
import gallery6 from './../../images/gallery6.jpg';
import gallery7 from './../../images/gallery7.jpg';
import gallery8 from './../../images/gallery8.jpg';
import gallery9 from './../../images/gallery9.jpg';
import gallery10 from './../../images/gallery10.jpg';
import gallery11 from './../../images/gallery11.jpg';
import gallery12 from './../../images/gallery12.jpg';
import gallery13 from './../../images/gallery13.jpg';
import gallery14 from './../../images/gallery14.jpg';
import gallery15 from './../../images/gallery15.jpg';
// Continue to import the rest of the images as needed

// Import the rest of your images

const Gallery = () => {
  // Alumni Magang images
  const alumniImages = [
    { id: 1, title: 'Unnes', src: gallery1 },
    { id: 2, title: 'Udinus', src: gallery10 },
    { id: 3, title: 'Unika', src: gallery10 },
    { id: 4, title: 'Undip', src: gallery10 },
    { id: 5, title: 'Polines', src: gallery10 },
    { id: 6, title: 'Unimus', src: gallery2 },
  ];

  // State to track current index for Alumni Magang slider
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle previous button click
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? alumniImages.length - 1 : prevIndex - 1));
  };

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === alumniImages.length - 1 ? 0 : prevIndex + 1));
  };

  // Define diskImages with the imported images
  const diskImages = [gallery1, gallery2, gallery3, gallery4, gallery5,
    gallery6, gallery7, gallery8, gallery9, gallery10,
    gallery11, gallery12, gallery13, gallery14, gallery15]; // Add all imported images

  return (
    <div className="gallery-container">
      <h1>GALLERY</h1>

      {/* Alumni Magang Section */}
      <div className="section alumni-magang">
        <h2>Alumni Magang</h2>
        <div className="image-slider">
          <button onClick={handlePrev} className="slider-btn prev-btn">
            ‹
          </button>
          {alumniImages.map((image, index) => (
            <div className="image-wrapper" key={index}>
              <img src={image.src} alt={image.title} />
              <p>{image.title}</p>
            </div>
          ))}
          <button onClick={handleNext} className="slider-btn next-btn">
            ›
          </button>
        </div>
      </div>

      {/* Seputar Diskominfo Section */}
      <section className="section alumni-magang">
        <h2>Seputar Diskominfo</h2>
        <div className="container gallery__container">
          {diskImages.map((image, index) => (
            <article key={index}>
              <a href={image} className="block" target="_blank" rel="noopener noreferrer">
                <img src={image} alt={`Gallery Image ${index + 1}`} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
