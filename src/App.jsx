import "./App.css";
import { Footer, Search } from "./components";
function App() {
  return (
    <>
      <div className="bg-cover bg-center h-screen bg-cats ">
        <div className="flex items-center sm:px-5 px-6 sm:py-16 py-15 max-w-7xl  mx-auto ">
          <Search />
        </div>
      </div>
    </>
  );
}

export default App;
