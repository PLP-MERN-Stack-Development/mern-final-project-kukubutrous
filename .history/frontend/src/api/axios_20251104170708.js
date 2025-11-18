import axios from 'axios'


const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })


// Request interceptor to attach token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})


// Response interceptor to handle 401
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)


export default api