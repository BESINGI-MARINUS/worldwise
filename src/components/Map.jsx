import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useState, useEffect } from "react";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesProvider";
import { useGeoLocation } from "../hooks/useGeolocation";
import { useUrlLocation } from "../hooks/useUrlLocation";
import Button from "./Button";

function Map() {
  const navigate = useNavigate();
  const [position, setPosition] = useState([4.1621622, 9.2857513]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingGeo,
    position: positionGeo,
    getPosition,
  } = useGeoLocation();

  const [mapLat, mapLng] = useUrlLocation();

  useEffect(() => {
    if (!positionGeo) return;
    setPosition([positionGeo.lat, positionGeo.lng]);
    navigate(`form?lat=${positionGeo.lat}&lng=${positionGeo.lng}`);
  }, [positionGeo, navigate]);

  useEffect(() => {
    if (mapLat || mapLng) setPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      {!positionGeo && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeo ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                {city.emoji} {city.country}
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={[position[0], position[1]]} />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function MapClickHandler() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
