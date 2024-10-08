import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.defaults.headers.common['Content-Type'] = 'application/json';
axiosClient.defaults.headers.common.Accept = 'application/json';

export default axiosClient;
