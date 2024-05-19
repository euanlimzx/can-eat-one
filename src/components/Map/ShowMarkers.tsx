import { Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import { memo, useState } from "react";
import type { LatLngBounds, LatLngTuple } from "leaflet";
// import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { debounce } from "lodash";

const MemoizedMarker = memo(
  ({ position, index }: { position: LatLngTuple; index: number }) => (
    <Marker position={position}>
      <Popup>Marker {index}</Popup>
    </Marker>
  )
);
MemoizedMarker.displayName = "MemoizedMarker";

const ShowMarkers = () => {
  const [currZoom, setCurrZoom] = useState(50);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);

  const data: LatLngTuple[] = [
    [1.309579, 103.827602],
    [1.309833, 103.833833],
    [1.304833, 103.831833],
    [1.304833, 103.831833],
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
    moveend: debounce(() => {
      setMapBounds(map.getBounds());
    }, 100),
    zoomend: debounce(() => {
      const zoom = map.getZoom();
      if (zoom) {
        setCurrZoom(zoom);
        console.log(zoom);
        setMapBounds(map.getBounds());
      }
    }, 100),
  });

  // Filter markers based on whether they fall within the current map bounds
  const visibleMarkers = data.filter(([lat, lng]) => {
    return mapBounds ? mapBounds.contains([lat, lng]) : false;
  });

  return (
    <>
      {currZoom > 12 ? (
        <>
          {/* <MarkerClusterGroup chunkedLoading> */}
            {visibleMarkers.map((position, idx) => (
              <MemoizedMarker key={idx} position={position} index={idx} />
            ))}
          {/* </MarkerClusterGroup> */}
        </>
      ) : null}
    </>
  );
};

export default ShowMarkers;
