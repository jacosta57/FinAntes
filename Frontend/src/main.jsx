import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/themes.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import App from 'pages/App'
import RootLayout from 'pages/RootLayout'
import Dashboard from 'pages/Dashboard'
import Settings from 'pages/Settings'
import Authors from 'pages/Authors'
import Editor from 'pages/Editor'

const router = createBrowserRouter(
  createRoutesFromElements((
    <Route path='/' element={<RootLayout />}>
      <Route path='/' element={<App />} />
      {<Route path='/authors' element={<Authors />}/>}
      {/* <Route path='/creditcards' element={<CreditCards />}/> */}
      <Route path='/dashboard' element={<Dashboard />} />
      {/* <Route path='/demo' element={<Demo />}/> */}
      <Route path='/editor' element={<Editor />}/>
      <Route path='/settings' element={<Settings />} />
    </Route>
  ))
)

const theme = localStorage.getItem("theme") || "light";
const colorScheme = localStorage.getItem("color") || "blue";

document.documentElement.setAttribute("data-theme", theme);
document.documentElement.setAttribute("data-color", colorScheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
