import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Exam from './pages/User/Exam'
// import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/exam" element={<Exam />} />
        <Route path="/" element={<Navigate to="/exam" replace />} />
      </Routes>
    </Router>
  )
}

export default App
