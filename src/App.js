import { BrowserRouter, Routes, Route } from "react-router-dom";
import AcadifyInterface from "./AcadifyInterface";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AcadifyInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

