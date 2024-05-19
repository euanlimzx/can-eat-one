import { Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import { useState } from "react";
const ShowMarkers = () => {
  const [currZoom, setCurrZoom] = useState(50);
  const map = useMapEvents({
    zoomend() {
      const zoom = map.getZoom();
      if (zoom) {
        setCurrZoom(zoom);
      }
    },
  });

  return (
    <>
      {currZoom > 16 ? (
        <Marker position={[1.304833, 103.831833]}>
          <Popup>You are here bobb</Popup>
        </Marker>
      ) : null}
    </>
  );
};

export default ShowMarkers;
