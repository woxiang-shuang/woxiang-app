import { UPDATE_USER_INFO } from '../constant';

export default function updateUserInfo(data) {
  return {
    type: UPDATE_USER_INFO,
    payload: data
  };
}
