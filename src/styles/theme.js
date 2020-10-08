import { px } from '../utils/adapter';

const Colors = {
  white: '#ffffff',
  gray: '#adadad',
  orange: '#f17d0b',
  yellow: '#fed500',
  red: '#fd5a58',
  blue: '#3B7CEC'
};

const theme = {
  activeOpacity: 0.8,
  clickOpacity: 0.8,
  shadowOpacity: 0.7,
  screenPaddingBottom: px(90),
  shadowColor: '#dce8fd',
  shadowColorSecond: '#EDEDED',
  text: {
    colorBlack: '#000000',
    colorGray: Colors.gray,
    colorWhite: Colors.white,
    colorShallowWhite: '#FFFDFD',
    colorRed: Colors.red,
    colorRed1: '#924E4E',
    color6: Colors.blue, // 蓝色
    color7: '#2C56DA', // 蓝色
    color8: '#7586A1',
    color9: '#3D4C63',
    color10: '#5A8DEE',
    color11: '#FD3729', // 红色
    color12: '#FF9A00', // 橙色
    color13: '#838383', // 灰色
    color14: '#475F7B', // 导航栏蓝
    color15: '#485A77',
    color16: '#A2A2A2', // 灰色
    color17: '#8798AD', // 灰色
    color18: '#374551', // 黑色
    color19: '#4E927C', // 绿色
    color20: '#924E4E', // 暗红
    color21: '#838383', // 灰色
    color22: '#EE5E5E', // 红色
    color23: '#56CB8F', // 叶绿色
    color24: '#30BEC7', // 绿色
    color25: '#727E8C', // 灰色
    color26: '#F7A323',
    color27: '#949AAF',// 保存灰
    color28: '#404D66',// 按钮置灰颜色
    color29: '#C1C0C9',
    color30: '#B0BED4',
    color31: '#273142',
    color32: '#5B5B5B',
    color33: '#FFCE49',// 标签橙
    color34: '#DDE9FF',
    color35: 'red',
    color36: '#3B7CEC',
    color37: '#2C3051',
    size12: px(12),
    size14: px(14),
    size18: px(18),
    size20: px(20),
    size22: px(22),
    size24: px(24),
    size26: px(26)
  },
  background: {
    colorWhite: Colors.white,
    colorRed: '#f44336',
    colorGray: '#eaeaea',
    colorGray1: '#363636',
    colorBlack: '#000000',
    colorYellow: '#feb500',
    color6: '#6ba2ff', // 浅蓝色
    color7: '#d1e6ff', // 淡淡蓝色
    color8: '#fbfdff',
    color9: '#EC665F',
    color10: '#586E87',
    color11: '#7286a4',
    color12: Colors.blue,
    color13: '#475F7B',
    color14: '#E8EFFE',
    color15: '#DAFAFC', // 绿
    color16: '#FFDEDE', // 红
    color17: '#E7FAF1', // 嫩绿
    color18: '#F9F8F8', // 灰色
    color19: '#FEC62B', // 黄色
    color20: '#273142',// 文字背景
    color21: '#FFF0F0',
    color22: '#FF6D6E'
  },
  border: {
    colorWhite: '#ffffff',
    colorGray: '#dddddd',
    colorGray1: '#d3d3d3',
    colorGray2: '#e9e9e9',
    colorGray3: '#bdbdbd',
    colorGray4: Colors.gray,
    colorRed: '#f44336',
    color1: '#e2d9f3', // 淡蓝色
    color2: Colors.blue, // 蓝色
    color3: '#E3E9F2',
    color4: '#475F7B',
    color5: '#5A8DEE',
    color6: '#2679f4',
    color7: Colors.white,
    color8: '#EFF2FF',
    color9: '#727E8C',
    color10: '#EE5E5E', // 红色
    color11: '#56CB8F', // 叶绿色
    color12: '#30BEC7', // 绿色
    color13: '#F5F5F5',
    color14: '#ADB0A7',
    color15: 'rgba(0,0,0,0.02)',
    color16: 'rgba(232,240,254,0.1)'
  },
  button: {
    color: '#5C92F9',
    bgColor: '#475F7B'
  },
  disable: {
    bgColor: '#586E87',
    bgColor1: '#ccd3e3'
  },
  competitionHeader: {
    navBarTabBd: Colors.blue,
    navBarActiveBgColor: Colors.blue,
    navBarTabActiveTxtColor: Colors.white,
  },
  competition: {
    badgeBackgroundColor: '#ff5b05',
    color: Colors.white,
    lightHeightBgColorOrange: '#FFAB2B',
    reminderBgColor: 'rgba(255,250,241, 0.9)',
    reminderTxtColor: '#7586A1',
    detail: {
      videoTypeBgColor: 'rgba(0, 0, 0, 0.30)',
      iconDotBgColorGreen: '#00CFDD',
      iconDotBgColorOrange: '#FFB757',
      eventNameTxtColor: '#838383',
      midLineColor: '#A6A5A5',
      textLiveInfoFlowBdColor: '#E3E9F2',
      textLiveInfoTimeTxtColor: '#B0BED4',
      textLiveInfoIconCircleBgColor: '#B0BED4',
      textLiveInfofirstIconCircleBgColor: '#4076D5',
    },
    background: {
      color1: '#ecf0f6'
    }
  },
  competitionListItem: {
    textColorRed: '#FD3729',
    textColorBlack: '#273142',
    textColorGreen: '#4E927C',
    textColorCoffee: '#924E4E',
    textCoorBlue: Colors.blue,
    yellowCardBgColor: '#F8D400',
    redCardBgColor: '#EC665F',
    plainInfoBgColor: '#D4E6FF',
    plainInfoTxtColor: '#3C94FF',
    borderBottomColor: '#E3E9F2',
    harlfScoreColor: '#353535'
  },
  header: {
    textColor: '#3D4C63',
    backgroundColor: '#fbfdff',
    borderColor: Colors.white,
    leftBackBorderColor: '#475F7B'
  },
  iconBack: {
    width: px(30),
    height: px(30),
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#475F7B',
    marginLeft: px(30),
    marginTop: px(30),
    transform: [{ rotate: '320deg' }]
  },
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#f44336',
    },
  },
  screenBgColor: '#FBFCFC',
  loadingBgColor: '#475F7B',
  findPassBgColor: '#FBFDFF',
  skeletonBdB: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E9F2'
  },
  skeletonItemBgColor: '#d9d9d9',
  skeletonItemForegroundColor: '#ecebeb',
  badge: {
    backgroundColor: '#3B7CEC',
    textColor: '#ffffff'
  },
  matchFilter: {
    bgColor: 'rgba(71,95,123,0.8)'
    // bgColor: '#fbfdff'
  },
  backgroundColor: {
    gary: '#cccccc',
    white: '#ffffff',
    tag:'#ffce491a',
    edit: 'rgba(71,95,123,0.8)',
    edit2: 'rgba(0,0,0,.5)',
    blue: '#475F7B',
    transparent: 'transparent',
    login: '#304162',
    loginL: '#CCD3E3',
    black: 'rgba(0,0,0,0)',
    sky: '#ecf2fd', // 天蓝色
    detailInfo: 'rgba(0,0,0,0.8)',
    video: '#f0f0f0',
    videobg: 'rgba(0, 0, 0, 0.2)'
  },
  tabBarOptions: {
    backgroundColor: Colors.white,
    inactiveTintColor: '#485a77', // 导航条文本颜色
    inactiveBackgroundColor: Colors.white, // 导航条背景颜色
    activeBackgroundColor: Colors.white, // 激活时导航条背景颜色
    activeTintColor: Colors.blue, // 激活时导航条文本颜色
    style: {
      height: 100
    }
  }
};

export default theme;
