import React, { useState, useEffect } from 'react';
import Map from './Map';
import CustomMarker from './CustomMaker';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState(null);
  const [distanceToDestination, setDistanceToDestination] = useState(null);
  const [timeToDestination, setTimeToDestination] = useState(null);

  // Coordinates of Kimironko
  const destination = [-1.9365670876910166, 30.13020167024439];

  // Get current location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        getCurrentLocationName([position.coords.latitude, position.coords.longitude]);
        calculateDistanceAndTimeToDestination([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Get current location name using reverse geocoding
  const getCurrentLocationName = async (location) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[0]}&lon=${location[1]}`);
    const data = await response.json();
    setCurrentLocationName(data.display_name);
  };

  // Calculate distance and time to destination (Kimironko)
  const calculateDistanceAndTimeToDestination = (currentLocation) => {
    const distanceToDestination = calculateDistance(currentLocation, destination);

    // Assuming average speed of 30 km/h
    const averageSpeed = 30; // km/h
    const timeToDestination = distanceToDestination / averageSpeed;

    setDistanceToDestination(distanceToDestination.toFixed(2));
    setTimeToDestination(timeToDestination.toFixed(2));
  };

  // Function to calculate distance between two points (in km)
  const calculateDistance = (coord1, coord2) => {
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };


  return (
    <div className='mx-20 my-1'>
      <h1 className='text-center py-2 text-xl font-medium'>Real-time Ride-Share Tracking</h1>
      <p className='text-center py-2 text-xl font-medium'>Nyabugogo - Kimironko</p>
      <p className='pb-5 text-xl text-center'>Bus Location Now: <span className='text-base text-blue-600 font-medium'>{currentLocationName}</span> </p>
      {distanceToDestination !== null && timeToDestination !== null && (
        <p className='text-center pb-3'>
          Distance to Kimironko: <span className='text-red-700 font-bold'>{distanceToDestination}  km</span>, Time to Kimironko: <span className='text-red-700 font-bold'>{timeToDestination} hours</span> 
        </p>
      )}
      <Map>
        {currentLocation && (
          <CustomMarker position={currentLocation} nextStop={[-1.939826787816454, 30.0445426438232]}>
            Current Location
          </CustomMarker>
        )}
        <CustomMarker position={[-1.939826787816454, 30.0445426438232]} nextStop={[-1.9355377074007851, 30.060163829002217]}>
          Nyabugogo
        </CustomMarker>
        <CustomMarker position={[-1.9355377074007851, 30.060163829002217]} nextStop={[-1.9358808342336546, 30.08024820994666]}>
          Stop A
        </CustomMarker>
        <CustomMarker position={[-1.9358808342336546, 30.08024820994666]} nextStop={[-1.9489196023037583, 30.092607828989397]}>
          Stop B
        </CustomMarker>
        <CustomMarker position={[-1.9489196023037583, 30.092607828989397]} nextStop={[-1.9592132952818164, 30.106684061788073]}>
          Stop C
        </CustomMarker>
        <CustomMarker position={[-1.9592132952818164, 30.106684061788073]} nextStop={[-1.9487480402200394, 30.126596781356923]}>
          Stop D
        </CustomMarker>
        <CustomMarker position={[-1.9487480402200394, 30.126596781356923]} nextStop={[-1.9365670876910166, 30.13020167024439]}>
          Stop E
        </CustomMarker>
        <CustomMarker position={[-1.9365670876910166, 30.13020167024439]} nextStop={[-1.9365670876910166, 30.13020167024439]}>
          Kimironko
        </CustomMarker>
      </Map>
    </div>
  );
};

export default App;
