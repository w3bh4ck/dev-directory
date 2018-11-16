import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
    authenticated: false,
    user: {} 
}


export default function(state = initialState, action){
    switch(action.type) {
        case SET_CURRENT_USER:
           return {
               ...state,
               isAuthenticated: action.payload //need to be looked into the more.
           } 
        default:
            return state;
    }
}