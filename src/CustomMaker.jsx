import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';

const CustomMarker = ({ position, children, nextStop }) => {
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  const markerRef = React.useRef();

 
  const calculateDistanceAndTime = () => {
    const distanceToNextStop = calculateDistance(position, nextStop);

   
    const averageSpeed = 30; 
    const timeToNextStop = distanceToNextStop / averageSpeed;

    setDistance(distanceToNextStop.toFixed(2));
    setTime(timeToNextStop.toFixed(2));
  };

  const calculateDistance = (coord1, coord2) => {
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];

    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  React.useEffect(() => {
    const marker = markerRef.current;

    if (marker) {
      marker.addEventListener('click', calculateDistanceAndTime);
    }

    return () => {
      if (marker) {
        marker.removeEventListener('click', calculateDistanceAndTime);
      }
    };
  }, [markerRef, position, nextStop]);

  return (
    <Marker position={position} ref={markerRef}>
      <Popup>
        {children}
        {distance !== null && time !== null && (
          <div>
            <p>Distance to next stop: {distance} km</p>
            <p>Time to next stop: {time} hours</p>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default CustomMarker;
