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
import PrivateRoute from 'pages/PrivateRoute'
import { AuthProvider } from 'AuthContext'
import axios from 'axios'
import { DataProvider } from 'DataContext'
import Checkout from 'pages/Checkout'
import ConfirmPremium from 'pages/ConfirmPremium'
import Demo from 'pages/Demo'

document.documentElement.setAttribute('data-theme', "dark");
document.documentElement.setAttribute('data-color', "blue");

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

const router = createBrowserRouter(
  createRoutesFromElements((
    <Route path='/' element={<RootLayout />}>
      {/* Public routes */}
      <Route path='/' element={<App />} />
      <Route path='/creditcards' element={<CreditCards />} />
      <Route path='/auth' element={<Authentication />} />
      <Route path='/authors' element={<Authors />} />
      <Route path='/checkout' element={<Checkout />}/>
      <Route path='/confirmPremium' element={<ConfirmPremium />}/>
      <Route path='/demo' element={<Demo />}/> 

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
    </Route>
  ))
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
)