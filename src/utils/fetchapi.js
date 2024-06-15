import axios from 'axios';

const getAll = async(urlApi)=>{
  try {
    const res = await axios.get(urlApi);
    return res.data;
  } catch (err) {
    console.error('error : ', err);
    return null 
  }
};

const getById = async(urlApi, id)=>{
  try {
    const res = await axios.get(`${urlApi}/${id}`);
    return res.data;
  } catch (err) {
    console.error('error', err);
    return null 
  }
};
const post = async(urlApi, data)=>{
  try {
    const res = await axios.post(urlApi, data);
    return res.data;
  } catch (err) {
    console.error('error', err);
    return null ;
  }
};

const func = {
  getAll,
  getById,
  post,
};
export default func ; 