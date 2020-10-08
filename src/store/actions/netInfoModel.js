import { UPDATE_DATAERROR, SETSTATE_NETINFOMODEL } from '../constant';

export function updataDataError(data) {
  return {
    type: UPDATE_DATAERROR,
    payload: data
  };
}

export function setStateNetInfoModel(data) {
  return {
    type: SETSTATE_NETINFOMODEL,
    payload: {
      ...data
    }
  };
}
