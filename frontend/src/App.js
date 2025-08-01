import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Unsubscribe from "./components/Unsubscribe";
import AlreadySubscribed from './components/AlreadySubsribed';

function App() {
  return (
    <Router>
    <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/already_unsubscribed" element={<AlreadySubscribed />} />

        </Routes>
        </main>
    </div>
    </Router>
  );
}

export default App;