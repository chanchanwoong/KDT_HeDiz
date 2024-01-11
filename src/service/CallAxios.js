import axios from 'axios';

const CallAxios = ({ method, url }) => {
  return new Promise((resolve, reject) => {
    axios[method](url)
      .then((response) => {
        console.log(response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

export default CallAxios;
