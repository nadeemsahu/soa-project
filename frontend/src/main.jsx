import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApexProvider } from './context/ApexContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApexProvider>
        <App />
      </ApexProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
