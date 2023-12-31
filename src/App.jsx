import "./App.css";
import { Weather } from "./components";
function App() {
  return (
    <>
      <div className="bg-cover  bg-center  bg-cats ">
        <div className="flex items-center sm:px-5 px-6 sm:py-20 py-20 max-w-7xl  mx-auto ">
          <Weather />
        </div>
      </div>
    </>
  );
}

export default App;
