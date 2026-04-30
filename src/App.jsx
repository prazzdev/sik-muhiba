import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CheckPage from "./pages/CheckPage";

function App() {
  return (
    <Router>
      <div className="font-sans text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cek" element={<CheckPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
