import { UPDATE_USER_INFO } from '../constant';

let initState = {
  nickname: '',
  phone: '',
  Bio: '',
  age: ''
};

export default function login(state = initState, action) {
  switch(action.type) {
  case UPDATE_USER_INFO:
    state = action.payload;
    return state;
  default:
    return state;
  }
}
