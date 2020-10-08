import { combineReducers } from 'redux';
import login from './login';
import userInfo from './userInfo';
import footerTabBar from './footerTabBar';
import netInfoModel from './netInfoModel';

const rootReducer = combineReducers(
  {
    login,
    userInfo,
    footerTabBar,
    netInfoModel
  }
);

export default rootReducer;
