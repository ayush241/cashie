import axios from "axios";

const http = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_API_URL,
	headers: {
		authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default http;