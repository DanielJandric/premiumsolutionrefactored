"use client";

/**
 * VideoBackground - Composant vidéo en arrière-plan avec fallback image
 */

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface VideoBackgroundProps {
  videoSrc: string;
  fallbackImage: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  poster?: string;
}

export function VideoBackground({
  videoSrc,
  fallbackImage,
  overlay = true,
  overlayOpacity = 0.5,
  className = '',
  poster,
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoLoaded(true);
    const handleError = () => {
      setHasError(true);
      setIsVideoLoaded(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video */}
      {!hasError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          poster={poster || fallbackImage}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback image */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isVideoLoaded && !hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Image
          src={fallbackImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
