import { UPDATE_FOOTER_TAB_BAR } from '../constant';

let initState = {
  show: true
};

export default function footerTabBar(state = initState, action) {
  switch (action.type) {
  case UPDATE_FOOTER_TAB_BAR:
    state = action.payload;
    return state;
  default:
    return state;
  }
}
