import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import{ ContextProvider }from './context/ContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
 
        <Router>
          <ContextProvider>
            <App />
          </ContextProvider>
        </Router>
)
