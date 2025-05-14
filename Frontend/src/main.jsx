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


document.documentElement.setAttribute('data-theme', "dark");
document.documentElement.setAttribute('data-color', "blue");

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/verify') &&
      !originalRequest.url?.includes('/api/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        await axios.post('/api/auth/refresh-token');
        return axios(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname.match(/^\/(dashboard|editor|settings)/)) { window.location.href = '/auth?tab=login' }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const router = createBrowserRouter(
  createRoutesFromElements((
    <Route path='/' element={<RootLayout />}>
      {/* Public routes */}
      <Route path='/' element={<App />} />
      <Route path='/creditcards' element={<CreditCards />} />
      <Route path='/auth' element={<Authentication />} />
      <Route path='/authors' element={<Authors />} />

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