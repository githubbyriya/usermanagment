import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = () => axios.get(API_URL);
export const createUser = (user) => axios.post(API_URL, user);
export const updateUser = (userId, user) => axios.put(`${API_URL}/${userId}`, user);
export const deleteUser = (userId) => axios.delete(`${API_URL}/${userId}`);
