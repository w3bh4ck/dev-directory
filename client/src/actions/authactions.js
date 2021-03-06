import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setauthtoken';
import jwt_decode from 'jwt-decode';

//register user
export const registerUser = (userData, history) => dispatch => {
      axios.post('api/users/register', userData)
          .then(res => history.push('/login'))
          .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        );
};

//login - get user token
export const loginUser = userData  => dispatch => {
  axios.post('/api/users/login', userData)
  .then(res => {
    //save token to local storage
    const { token } = res.data;
    //set token to ls
    localStorage.setItem('jwtToken', token)
    //set token to the auth header
    setAuthToken(token);
    //decode token to get users data
    const decoded = jwt_decode(token);
    //set current user
    dispatch(setCurrentUser(decoded)); 
  }).catch(err =>dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }) 
  );
};

//set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}