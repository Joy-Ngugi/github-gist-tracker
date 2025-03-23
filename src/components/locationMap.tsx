"use client";
import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function LocationMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(location);
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (!userLocation || !mapContainerRef.current) return;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 15,
    });

    // Add marker at the user's location
    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(userLocation)
      .addTo(map);

    // Keep track of map and marker
    mapRef.current = map;
    markerRef.current = marker;

    return () => map.remove(); // Clean up on unmount
  }, [userLocation]);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-4 mt-15">Your Location</h2>

      {userLocation ? (
        <div ref={mapContainerRef} className="w-full max-w-3xl h-96 rounded-lg shadow-lg overflow-hidden" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-500 text-center mt-2">Getting your location...</p>
        </div>
      )}
    </div>
  );
}

