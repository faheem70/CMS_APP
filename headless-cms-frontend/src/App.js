import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Create from './components/Create';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Create />} />
        </Routes>
    </div>
    </Router>

  )
}

export default App