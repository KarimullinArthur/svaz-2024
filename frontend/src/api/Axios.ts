import axios from 'axios';
import { redirect } from 'react-router-dom';
import { baseUrl } from './baseUrl';

const api = axios.create({
  baseURL: baseUrl+":3000",
  headers: {withCredentials:true},
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle unauthorized errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to home page
      redirect('/home')
    }
    return Promise.reject(error);
  }
);
api.interceptors.request.use(request=>{
  request.headers.Authorization = localStorage.getItem('access_token')
  return request
})

export const Axios = api