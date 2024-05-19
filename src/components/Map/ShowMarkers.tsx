import { Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import { useState } from "react";
import type { LatLngBounds, LatLngTuple } from "leaflet";
const ShowMarkers = () => {
  const [currZoom, setCurrZoom] = useState(50);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);

  const data: LatLngTuple[] = [
    [1.309579, 103.827602],
    [1.344335, 103.752215],
    [1.31945, 103.876238],
    [1.368412, 103.882114],
    [1.276743, 103.795427],
    [1.356217, 103.946271],
    [1.296648, 103.852081],
    [1.283874, 103.833622],
    [1.353801, 103.871205],
    [1.308621, 103.769214],
  ];

  const map = useMapEvents({
    moveend() {
      setMapBounds(map.getBounds());
    },
    zoomend() {
      const zoom = map.getZoom();
      if (zoom) {
        setCurrZoom(zoom);
      }
    },
  });

  // Filter markers based on whether they fall within the current map bounds
  const visibleMarkers = data.filter(([lat, lng]) => {
    return mapBounds ? mapBounds.contains([lat, lng]) : false;
  });

  return (
    <>
      {currZoom > 1 ? (
        <>
          {visibleMarkers.map((position, idx) => (
            <Marker key={idx} position={position}>
              <Popup>Marker {idx}</Popup>
            </Marker>
          ))}
        </>
      ) : null}
    </>
  );
};

export default ShowMarkers;
