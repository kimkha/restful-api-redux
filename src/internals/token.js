
let tk = null;

export const saveToken = (token) => {
  console.log('Save token: ' + JSON.stringify(token));
  tk = token;
};

export const getToken = () => tk;
