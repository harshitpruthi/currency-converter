import './App.css';

import React, {
  lazy,
  Suspense,
} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

const CurrencyConverterPage = lazy(() => import('./views/CurrencyConverterPage'));
const ConversionHistoryPage = lazy(() => import('./views/ConversionHistoryPage'));


function App() {
  return (
    <div className="App">
       <Router>
        <Suspense fallback={<div></div>}>
          <Routes>
            <Route path="/" exact element={<CurrencyConverterPage />} />
            <Route path="/currency-converter" exact element={<CurrencyConverterPage />} />
            <Route path="/conversion-history" exact element={<ConversionHistoryPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
