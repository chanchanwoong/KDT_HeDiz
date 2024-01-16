import axios from 'axios';

const token = localStorage.getItem('jwtauthtoken');

const CallAxios = ({ method, url }) => {
  return new Promise((resolve, reject) => {
    axios[method](url),
      { headers: { jwtauthtoken: token } }
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
