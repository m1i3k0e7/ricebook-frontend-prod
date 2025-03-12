import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ricebook-ct100-33acd3c66081.herokuapp.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
