import { StyleSheet } from 'react-native';
import { px } from '../utils/adapter';
import theme from './theme';

export function txtEllipsis(txt = '', len = 5) {
  if (null == txt) return '';
  return txt.length > len ? txt.substr(0, len) + '...' : txt;
}

const styles = StyleSheet.create({
  contaienr: {
    flex: 1,
    backgroundColor: theme.screenBgColor
  },
  fz16: { fontSize: px(16) },
  fz18: { fontSize: px(18) },
  fz20: { fontSize: px(20) },
  fz22: { fontSize: px(22) },
  fz23: { fontSize: px(23) },
  fz24: { fontSize: px(24) },
  fz26: { fontSize: px(26) },
  txtColorWhite: { color: theme.text.colorWhite },
  fwB: { fontWeight: 'bold' },
  flexDirecR: { flexDirection: 'row' },
  flexDirecC: { flexDirection: 'column' },
  flexJcC: { justifyContent: 'center' },
  flexJcF: { justifyContent: 'flex-start' },
  flexJcSb: { justifyContent: 'space-between' },
  flexJcFs: { justifyContent: 'flex-start' },
  flexJcFe: { justifyContent: 'flex-end' },
  flexAiL: { alignItems: 'flex-start' },
  flexAiC: { alignItems: 'center' },
  flexAiFe: { alignItems: 'flex-end' },
  flexWpWp: { flexWrap: 'wrap' },
  flex1: { flex: 1 },
  pdLR10: {
    paddingLeft: px(10),
    paddingRight: px(10)
  },
  pd20: {
    padding: px(20),
  },
  pdL10: {
    paddingLeft: px(10),
  },
  pdR10: {
    paddingRight: px(10),
  },
  pdL20: {
    paddingLeft: px(20),
  },
  pdR20: {
    paddingRight: px(20),
  },
  mgT4: { marginTop: px(4) },
  mgT6: { marginTop: px(6) },
  mgT8: { marginTop: px(8) },
  mgT10: { marginTop: px(10) },
  mgT12: { marginTop: px(12) },
  mgT20: { marginTop: px(20) },
  mgR10: { marginRight: px(10) },
  mgR20: { marginRight: px(20) },
  mgL10: { marginLeft: px(10) },
  mgL20: { marginLeft: px(20) },
  ovhide: { overflow: 'hidden' },
  txtC: { textAlign: 'center' },
  txtL: { textAlign: 'left' },
  txtR: { textAlign: 'right' },
  posAbs: { position: 'absolute' },
  pr0: { right: 0 },
  pl0: { left: 0 },
  bd: {
    borderWidth: 1
  },
  hide: { display: 'none' },
  w100: { width: '100%' }
});

export default styles;
