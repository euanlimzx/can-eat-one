import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Flex, Text } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";

const MapComponent = () => {
  const [loadMap, setLoadMap] = useState(false);
  const [currPosition, setCurrPosition] = useState({
    latitude: 1.3521,
    longitude: 103.8198,
  });
  const OnGeolocationSuccess = (position: GeolocationPosition) => {
    setCurrPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setLoadMap(true);
  };
  const OnGeolocationError = (error: GeolocationPositionError): void => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        alert(
          "Permission to access location was denied. Please enable location permissions in your browser settings for the best browsing experience."
        );
        setLoadMap(true);
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        alert(
          "Location information is currently unavailable. Please try again later."
        );
        setLoadMap(true);
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        alert("The request to get your location timed out. Please try again.");
        setLoadMap(true);
        break;
      default:
        console.error("An unknown error occurred.");
        alert(
          "An unknown error occurred while attempting to access your location."
        );
        setLoadMap(true);
        break;
    }
  };
  useEffect(() => {
    if (!loadMap) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          OnGeolocationSuccess,
          OnGeolocationError
        );
      } else {
        alert(
          "Unsupported browser detected. Unable to fetch current user location."
        );
      }
    }
  }, [loadMap]);

  return (
    <>
      {loadMap ? (
        <Box w="100vw" h="100vh">
          <MapContainer
            center={[currPosition.latitude, currPosition.longitude]}
            zoom={50}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[currPosition.latitude, currPosition.longitude]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      ) : (
        <Flex w="100%" h="100vh" justifyContent="center" alignItems="center">
          <Text fontSize="x-large">
            Please enable location services for the best viewer experience!
          </Text>
        </Flex>
      )}
    </>
  );
};

export default MapComponent;
