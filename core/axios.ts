import axios from 'axios';
import Cookies from 'js-cookie'

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
