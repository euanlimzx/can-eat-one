import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import type { LatLngTuple, Map } from "leaflet";
import {Search2Icon} from '@chakra-ui/icons'
import { Box, Button, Flex, HStack, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";
import { useEffect, useRef, useState } from "react";
import ShowMarkers from "./ShowMarkers";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const MapComponent = () => {
  // INITIALIZING MAP
  const mapRef = useRef<Map | null>(null);
  const [loadMap, setLoadMap] = useState(false);
  const [currPosition, setCurrPosition] = useState<LatLngTuple>([
    1.304833, 103.831833,
  ]);
  const [searchedLocation, setSearchedLocation] = useState<string>("")
  const searchLocationQuery = api.searchLocation.getLocation.useQuery(
    {locationQuery: searchedLocation},
    {enabled: false}
  )
  const OnGeolocationSuccess = (position: GeolocationPosition) => {
    setCurrPosition([position.coords.latitude, position.coords.longitude]);
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

  const flyToLocation = (position: LatLngTuple) => {
    if (mapRef.current) {
      mapRef.current.flyTo(position, 18);
    }
  };
  function handleInputSubmit(event: any): void { // yes I know
    if (event.key === 'Enter') {
      return handleSearch()
    }
  }
  const handleSearch = () => {
    searchLocationQuery.refetch()
    console.log(searchLocationQuery.data.locations)
    if (searchLocationQuery.data!.locations) {
      flyToLocation([searchLocationQuery!.data!.locations[0]!.latitude, searchLocationQuery!.data!.locations[0]!.longitude]);
    } else {
      flyToLocation([searchLocationQuery!.data!.latitude!, searchLocationQuery!.data!.longitude!]);
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
            <VStack spacing={3}>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <Search2Icon/>
                </InputLeftElement>
                <Input 
                  placeholder="Search location..."
                  variant="filled"
                  onChange={
                    (event) => setSearchedLocation(event?.target.value)
                  }
                  onKeyDown={
                    (event) => handleInputSubmit(event)
                  }
                />
              </InputGroup>
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
            </VStack>
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
