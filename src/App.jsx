import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Selezione from './components/Selezione';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/selezione" element={<Selezione />} />
      </Routes>
    </Router>
  );
}

export default App;