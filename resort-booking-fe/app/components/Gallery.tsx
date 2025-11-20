import React from 'react';
import Image from 'next/image';

const Gallery = () => {
  const images = [
    {
      src: '/assets/resort-image-1.webp',
      alt: 'Spa Treatment',
    },
    {
      src: '/assets/resort-image-2.jpg',
      alt: 'Resort Night View',
    },
    {
      src: '/assets/resort-image-3.webp',
      alt: 'Hot Tub View',
    },
    {
      src: '/assets/resort-image-4.webp',
      alt: 'Resort Pool View',
    },
    {
      src: '/assets/resort-image-5.webp',
      alt: 'Luxury Suite View',
    },
    {
      src: '/assets/resort-image-6.webp',
      alt: 'Beach View',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our beautiful resort
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-64 sm:h-72 overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white text-lg font-semibold p-4">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

