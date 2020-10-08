import { UPDATE_LOGIN,UPDATE_LOGINOUT } from '../constant';

let initState = {
  login: false,
  loginInfo:{}// 登陆后用户信息
};

export default function login(state = initState, action) {
  switch(action.type) {
  case UPDATE_LOGIN:
    return{
      ...state,
      loginInfo: action.payload,
      login:true
    };
  case UPDATE_LOGINOUT:
    return{
      ...state,
      login:false,
      loginInfo: action.payload,  
    };
  default:
    return state;
  }
}
