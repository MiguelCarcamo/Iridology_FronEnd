import { BrowserRouter, Routes, Route} from 'react-router-dom'
import SignInSide from './Pages/SignInSide'
import NewAccountSide from './Pages/NewAccountSide'
import Main from './Pages/Menu'
import NotFoundPage from './Pages/NotFoundPage'
import React, { useState, useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'AppIridology';
  },[]);
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/Main/:ruta" element={<Main />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/NewAccountSide" element={<NewAccountSide />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
