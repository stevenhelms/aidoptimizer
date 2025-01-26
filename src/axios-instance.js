import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://aidapi.bioinformatix.io/',
});

export default instance;
