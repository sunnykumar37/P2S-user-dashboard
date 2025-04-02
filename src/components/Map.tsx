import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { useTheme } from '../context/ThemeContext';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default center - this will be overridden if we get the user's location
const defaultCenter = {
  lat: 31.326,
  lng: 75.576 // Coordinates for Jalandhar, Punjab
};

interface MapProps {
  apiKey: string;
}

const libraries = ['places'];

const Map: React.FC<MapProps> = ({ apiKey }) => {
  const { isDarkMode } = useTheme();
  const [center, setCenter] = useState(defaultCenter);
  const [radius, setRadius] = useState(5000); // 5km in meters
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationDetails, setLocationDetails] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load user's location when component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(currentLocation);
          setMarkers([currentLocation]);
          if (map) {
            map.panTo(currentLocation);
          }
          
          // Get address from coordinates using Geocoder
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: currentLocation }, (results, status) => {
            setIsLoading(false);
            if (status === "OK" && results && results[0]) {
              setLocationDetails({
                address: results[0].formatted_address,
                lat: currentLocation.lat,
                lng: currentLocation.lng
              });
              setShowLocationPopup(true);
            } else {
              setLocationDetails({
                address: "Address not found",
                lat: currentLocation.lat,
                lng: currentLocation.lng
              });
              setShowLocationPopup(true);
            }
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
          setIsLoading(false);
          alert("Could not get your location. Please check your browser permissions.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseInt(e.target.value) * 1000); // Convert km to meters
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const newCenter = {
            lat: location.lat(),
            lng: location.lng()
          };
          
          setCenter(newCenter);
          setMarkers([newCenter]);
          
          if (map) {
            map.panTo(newCenter);
            map.setZoom(14);
          }
        } else {
          alert("Location not found. Please try another search.");
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Dark mode map styles
  const darkModeStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

  return (
    <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Interactive Map</h2>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          My Location
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-3/4 relative">
          <LoadScript googleMapsApiKey={apiKey} libraries={libraries as any}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: isDarkMode ? darkModeStyles : [],
                fullscreenControl: true,
                mapTypeControl: true,
                streetViewControl: false,
                zoomControl: true
              }}
            >
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker}
                  animation={google.maps.Animation.DROP}
                />
              ))}
              <Circle
                center={center}
                radius={radius}
                options={{
                  strokeColor: '#2563EB',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#3B82F6',
                  fillOpacity: 0.15,
                }}
              />
            </GoogleMap>
          </LoadScript>

          {/* Location Popup */}
          {showLocationPopup && locationDetails && (
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-64 p-4 rounded-lg shadow-lg z-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">Your Location</h3>
                <button 
                  onClick={() => setShowLocationPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm">
                <p className="mb-2">{locationDetails.address}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Latitude:</span>
                    <div>{locationDetails.lat.toFixed(6)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span>
                    <div>{locationDetails.lng.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={`w-full md:w-1/4 p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
          <h3 className="text-lg font-semibold mb-4">Location Controls</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search location</label>
            <div className="flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search location..."
                className={`flex-1 px-3 py-2 border rounded-l-lg ${
                  isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'
                }`}
                style={{ color: isDarkMode ? 'white' : 'black' }}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Search Radius: {radius/1000} km</h4>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={radius/1000} 
              onChange={handleRadiusChange}
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-sm mt-1">
              <span>1km</span>
              <span>20km</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Nearby Locations</h3>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm">Showing results within {radius/1000}km of the selected location.</p>
              <div className="mt-2">
                {markers.length > 0 ? (
                  <div className="text-sm">
                    <div className="font-medium">Current location:</div>
                    <div>Lat: {center.lat.toFixed(6)}</div>
                    <div>Lng: {center.lng.toFixed(6)}</div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Click "My Location" to see your current location</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map; 