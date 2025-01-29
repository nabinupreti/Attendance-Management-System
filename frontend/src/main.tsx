import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import StudentDashboard from './app/dashboard2/studentDashboard.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)