import React, { useState, useEffect } from 'react';
import Map from './Map';
import CustomMarker from './CustomMaker';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState(null);

  // Get current location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        getCurrentLocationName([position.coords.latitude, position.coords.longitude]);
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

  return (
    <div>
      <h1>Real-time Ride-Share Tracking</h1>
      <p>Current Location: {currentLocationName}</p>
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
