import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);

  function getPosition() {
    // 1. Check if the browser supports geolocation
    if (!navigator.geolocation)
      return setError("Your Browser does not support geolocation");

    setIsLoading(true);
    // 2. Get the current position of the user
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPosition({ lat, lng });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    );
  }

  return { error, isLoading, position, getPosition };
}
