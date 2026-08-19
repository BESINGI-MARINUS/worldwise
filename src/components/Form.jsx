import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesProvider";
import "react-datepicker/dist/react-datepicker.css";

import convertToEmoji from "../utils/convertToEmoji";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlLocation } from "../hooks/useUrlLocation";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const [lat, lng] = useUrlLocation();
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const { createCity, isLoading } = useCities();

  useEffect(
    function () {
      async function getCity() {
        try {
          setError("");

          const res = await fetch(
            `${BASE_URL}latitude=${lat}&longitude=${lng}`,
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else on the map 😉.",
            );
          setCityName(data.city || data.locality);
          setCountry(data.countryName);
          setCountryCode(data.countryCode);
        } catch (error) {
          setError(error.message);
        }
      }

      getCity();
    },
    [lat, lng],
  );

  function handleAddCity(e) {
    e.preventDefault();
    if (!cityName || !date) return setError("City and date are required!");

    const newCity = {
      cityName,
      country,
      emoji: countryCode,
      date,
      notes,
      position: { lat, lng },
    };

    createCity(newCity);
  }

  if (isLoading) return <Spinner />;
  if (error) return <Message message={error} type="error" />;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{convertToEmoji(countryCode)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd-MM-yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={(e) => handleAddCity(e)}>
          Add
        </Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
