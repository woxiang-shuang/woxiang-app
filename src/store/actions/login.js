import { UPDATE_LOGIN, UPDATE_LOGINOUT} from '../constant';

export default function updateLogin(data) {
  return {
    type: UPDATE_LOGIN,
    payload: data
  };
}
export function updateLogout(data) {
  return {
    type: UPDATE_LOGINOUT,
    payload: data
  };
}

