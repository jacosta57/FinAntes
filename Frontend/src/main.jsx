import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/themes.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import App from 'pages/App'
import RootLayout from 'pages/RootLayout'
import Dashboard from 'pages/Dashboard'
import Settings from 'pages/Settings'
import CreditCards from 'pages/CreditCards'
import Authors from 'pages/Authors'
import Editor from 'pages/Editor'
import Authentication from 'pages/Authentication'
import axios from 'axios'

const router = createBrowserRouter(
  createRoutesFromElements((
    <Route path='/' element={<RootLayout />}>
      <Route path='/' element={<App />} />
      {<Route path='/creditcards' element={<CreditCards />} />}
      {<Route path='/auth' element={<Authentication />} />}
      {<Route path='/authors' element={<Authors />} />}
      <Route path='/dashboard' element={<Dashboard />} />
      {/* <Route path='/demo' element={<Demo />}/> */}
      <Route path='/editor' element={<Editor />} />
      <Route path='/settings' element={<Settings />} />
    </Route>
  ))
)

const theme = localStorage.getItem("theme") || "light";
const colorScheme = localStorage.getItem("color") || "blue";

document.documentElement.setAttribute("data-theme", theme);
document.documentElement.setAttribute("data-color", colorScheme);

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
