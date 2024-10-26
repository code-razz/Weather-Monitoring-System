import AlertForm from "./components/AlertForm";
import AlertSettings from "./components/AlertSettings";
import MetrosWeather from "./components/MetrosWeather";
import WeatherChart from "./components/WeatherChart";

function App() {
  return (
    <div>
      <MetrosWeather />
      {/* <AlertSettings /> */}
      <AlertForm />
      <WeatherChart />
    </div>
  );
}

export default App;
