import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import RootLayout from './pages/RootLayout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'

const router = createBrowserRouter(
  createRoutesFromElements((
    <Route path='/' element={<RootLayout />}>
      <Route path='/' element={<App />}/>
      {/* <Route path='/authors' element={<Authors />}/> */}
      {/* <Route path='/creditcards' element={<CreditCards />}/> */}
      <Route path='/dashboard' element={<Dashboard />}/>
      {/* <Route path='/demo' element={<Demo />}/> */}
      {/* <Route path='/finances' element={<Finances />}/> */}
      {/* <Route path='/settings' element={<Settings />}/> */}
    </Route>
  ))
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

