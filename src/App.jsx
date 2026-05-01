import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CheckPage from "./pages/CheckPage";
import SKLPage from "./pages/SKLPage";

function App() {
  return (
    <Router>
      <div className="font-sans text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cek" element={<CheckPage />} />
          <Route path="/print-skl" element={<SKLPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
