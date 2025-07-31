import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import LoginPage from './views/LoginView';
import DashBoardView from './views/DashBoardView';
import PrivacyView from './views/PrivacyView';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashBoardView />} />
          <Route path="/privacy" element={<PrivacyView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
