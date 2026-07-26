import { useCities } from "../contexts/CitiesProvider";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";

function CountryList() {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((acc, city) => {
    if (acc.map((el) => el.country).includes(city.country)) {
      return acc;
    } else {
      return [...acc, { emoji: city.emoji, country: city.country }];
    }
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
