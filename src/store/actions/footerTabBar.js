import { UPDATE_FOOTER_TAB_BAR } from '../constant';

export default function updateLogin(data) {
  return {
    type: UPDATE_FOOTER_TAB_BAR,
    payload: data
  };
}
