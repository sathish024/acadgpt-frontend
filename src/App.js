import { BrowserRouter, Routes, Route } from "react-router-dom";
import AcadifyInterface from "./AcadifyInterface";
import Login from "./login.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="AcadifyInterface" element={<AcadifyInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

