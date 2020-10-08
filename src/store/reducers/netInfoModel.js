import { UPDATE_NETSTATUS, UPDATE_DATAERROR, SETSTATE_NETINFOMODEL } from '../constant';

let initState = {
  netStatus: false, // 用户是否链接网络
  dataError: false, // 用户是否在主页面数据错误
};

export default function NetInfoModel (state = initState, action) {
  switch(action.type) {
  case UPDATE_NETSTATUS:
    return{
      ...state,
      netStatus: action.payload
    };
  case UPDATE_DATAERROR:
    return {
      ...state,
      dataError: action.payload
    };
  case SETSTATE_NETINFOMODEL:
    return {
      ...state,
      ...action.payload
    };
  default:
    return state;
  }
}
