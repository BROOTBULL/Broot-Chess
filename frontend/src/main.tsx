import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import{ ContextProvider }from './context/ContextProvider.tsx'
import { NotificationProvider } from './context/NotificationProvider.tsx'

createRoot(document.getElementById('root')!).render(
 
        <Router>
          <NotificationProvider>
          <ContextProvider>
            <App />
          </ContextProvider>
          </NotificationProvider>
        </Router>
)
