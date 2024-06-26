import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import type { LatLngTuple, Map } from "leaflet";
import { Box, Button, Flex, HStack, Text} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";
import { useEffect, useRef, useState } from "react";
import ShowMarkers from "./ShowMarkers";
import Search from "../Search";

const MapComponent = () => {
  // INITIALIZING MAP
  const mapRef = useRef<Map | null>(null);
  const [loadMap, setLoadMap] = useState(false);
  const [currPosition, setCurrPosition] = useState<LatLngTuple>([
    1.304833, 103.831833,
  ]);
  const OnGeolocationSuccess = (position: GeolocationPosition) => {
    setCurrPosition([position.coords.latitude, position.coords.longitude]);
    setLoadMap(true);
  };
  const OnGeolocationError = (error: GeolocationPositionError): void => {
    console.log("error")
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

  const flyToLocation = (position: LatLngTuple) => {
    if (mapRef.current) {
      mapRef.current.flyTo(position, 18);
    }
  };
  
  return (
    <>
      {loadMap ? (
        <Box w="100vw" h="100vh" overflow="hidden">
          <Flex
            position="fixed"
            bottom="50"
            zIndex={99}
            w="100vw"
            justifyContent="center"
          >
            <Flex flexDir="column" justifyContent="space-between" height="80vh">
              <Search/>
              <HStack spacing={3}>
                <Button
                  variant="solid"
                  colorScheme="red"
                  size="lg"
                  boxShadow="lg"
                  onClick={() => flyToLocation(currPosition)}
                >
                  Curr Location
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  size="lg"
                  boxShadow="lg"
                  onClick={() => flyToLocation([1.304833, 103.831833])}
                >
                  Random Location
                </Button>
              </HStack>
            </Flex>
          </Flex>
          <MapContainer
            center={currPosition}
            zoom={50}
            scrollWheelZoom={true}
            className={styles.map}
            ref={mapRef}
          >
            <TileLayer
             attribution='&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
              url="https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png"
            />
            <ShowMarkers />
            <Marker position={currPosition}>
              <Popup>You are here</Popup>
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
