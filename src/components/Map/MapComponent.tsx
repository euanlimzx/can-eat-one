import { MapContainer, Marker, TileLayer, useMap, Popup, } from "react-leaflet";
import L from "leaflet"
import { Box, Text } from "@chakra-ui/react";
import 'leaflet/dist/leaflet.css'
import styles from './Map.module.css'
import { useEffect, useState } from "react";

const MapComponent = () => {
  const [currPosition, setCurrPosition] = useState({
    latitude: 1.3521,
    longitude: 103.8198,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCurrPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(currPosition)
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  const size = 100
  return (
    <>
      <Box w="100vw" h="100vh">
        <MapContainer
          center={[currPosition.latitude, currPosition.longitude]}
          zoom={13}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[currPosition.latitude, currPosition.longitude]}
            icon={L.divIcon({
              iconSize: [size, size],
              iconAnchor: [size / 2, size + 9],
              className: "mymarker",
              html: "😁",
            })}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </>
  );
};

export default MapComponent