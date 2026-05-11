import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gtblue-950">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/evaluacion"     element={<Assessment />} />
            <Route path="/resultados/:id" element={<Results />} />
            <Route path="/historial"      element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
