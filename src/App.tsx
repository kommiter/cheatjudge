import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Calibration from './pages/Calibration'
import Exam from './pages/User/Exam'
// import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/calibration" element={<Calibration />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/" element={<Navigate to="/calibration" replace />} />
      </Routes>
    </Router>
  )
}

export default App
