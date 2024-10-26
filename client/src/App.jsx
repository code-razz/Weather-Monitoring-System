import AlertForm from "./components/AlertForm";
import MetrosWeather from "./components/MetrosWeather";
import WeatherChart from "./components/WeatherChart";

function App() {
  return (
    <div
      className="min-h-screen bg-[url('/resources/bg_img.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-white bg-opacity-40 min-h-screen p-8">
        <MetrosWeather />
        {/* <AlertSettings /> */}
        <AlertForm />
        <WeatherChart />
      </div>
    </div>
  );
}

export default App;

