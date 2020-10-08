/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import AppActions from '../../store/actions';
import { px } from '../../utils/adapter';
import cstyle, { txtEllipsis } from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import { ShadowBox } from 'react-native-neomorph-shadows';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import { Toast, Portal } from '@ant-design/react-native';
import { enptyFn } from '../../utils/common';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络

const bg = require('../../assets/images/shop-site.png');

const TEAM_HOME = 'home';
const TEAM_AWAY = 'away';

const mapState = (state) => {
  return {
    netStatus: state.netInfoModel.netStatus
  };
};

function Team(props) {
  const [teamInfo, setTeamInfo] = React.useState({});
  const [members, setMembers] = React.useState([]);
  const [curTab, setCurTab] = React.useState(TEAM_HOME);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  let [detailTabsError, setDetailTabsError] = React.useState(false);
  const { netStatus } = props;

  React.useEffect(() => {
    getData();
  }, []);

  function tabHandler(type) {
    setCurTab(type);
    setMembers(type === TEAM_HOME ? teamInfo.homePlayerList : teamInfo.awayPlayerList);
  }

  /**
   * 获取阵容信息
   */
  const getData = React.useCallback(() => {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getTeamOfDetail({matchId: props.matchId, matchTypeId: props.matchTypeId}).then((res) => {
      let data = res.data;
      if (data && data?.homePlayerList?.length > 0) {
        setTeamInfo(data);
        setMembers(data.homePlayerList);
      }
    })
      .catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        setDetailTabsError(true);
        console.log('错误', err);
      })
      .finally(() => {
        setDataLoaded(true);
        Portal.remove(key);
      });
  }, [props.matchId, props.matchTypeId, setTeamInfo, setMembers, setDataLoaded, setDetailTabsError]);

  const netWorkOnPress = React.useCallback(() => {
    setDetailTabsError(false);
    getData();
  }, [getData, setDetailTabsError]);

  return (
    <View style={styles.container}>
      {detailTabsError ? netStatus ? <NetWorkError onPress={netWorkOnPress} /> : <NoInternet /> : <ScrollView style={cstyle.pd20} showsVerticalScrollIndicator={false}>
        {(dataLoaded && members.length > 0) && 
        <View style={[cstyle.flex1, cstyle.flexAiC]}>
          <View style={[cstyle.flexDirecR, styles.tab]}>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios styles.shadowLeft
              style={Object.assign({}, styles.shadow, curTab === TEAM_HOME ? styles.shadowLeft : styles.noShadow)}
            >
              <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={() => tabHandler(TEAM_HOME)} style={cstyle.flex1, { borderWidth: 0 }}>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.tabItem, styles.tabLeft, curTab === TEAM_HOME ? styles.active : styles.unactive]}>
                  <Image source={{ uri: props.mydata?.homeLogo }} style={styles.icon} />
                  <Text style={[cstyle.mgL10, curTab === TEAM_HOME ? styles.activeTxt : styles.unactiveTxt]}>{txtEllipsis(props.mydata?.homeNameZh, 5)}</Text>
                </View>
              </TouchableOpacity>
            </ShadowBox>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios styles.shadowLeft
              style={Object.assign({}, styles.shadow, curTab === TEAM_AWAY ? styles.shadowRight : styles.noShadow)}
            >
              <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={() => tabHandler(TEAM_AWAY)} style={cstyle.flex1}>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.tabItem, styles.tabRight, curTab === TEAM_AWAY ? styles.active : styles.unactive]}>
                  <Text style={[cstyle.mgR10, curTab === TEAM_AWAY ? styles.activeTxt : styles.unactiveTxt]}>{txtEllipsis(props.mydata?.awayNameZh, 5)}</Text>
                  <Image source={{ uri: props.mydata?.awayLogo }} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </ShadowBox>
          </View>
          <View style={[cstyle.flexDirecR, cstyle.flexJcC, styles.membersWp]}>
            <ImageBackground source={bg} style={styles.bg}>
              {members && members.map((item, i) => (
                <View key={curTab + i} style={[styles.member, { position: 'absolute', left: item.position_x - px(16) + '%', top: item.position_y - px(10) + '%' }]}>
                  <View style={styles.avatorWp}>
                    {/* <View style={styles.shirtNumWp}><Text style={[cstyle.fz16, { fontWeight: 'bold' }]}>{item.shirt_number}</Text></View> */}
                    <View style={styles.avatorBg}><Text>{item.shirt_number}</Text></View>
                    {/* <Image source={{ uri: item.logo }} style={styles.avator} /> */}
                  </View>
                  <View style={[styles.nameWp, cstyle.flexAiC, cstyle.flexJcC]}><Text style={cstyle.fz16}>{item.name}</Text></View>
                </View>
              ))}
            </ImageBackground>
          </View>
        </View>
        }
        {dataLoaded && members.length == 0 && <NoDataPlaceHolder msg="本场赛事暂无阵容信息" />}
      </ScrollView>}
    </View>
  );
}

export default connect(mapState)(Team);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  tab: {
    width: px(560),
    height: px(76),
    marginTop: px(6)
  },
  tabItem: {
    width: px(280)
  },
  unactive: {
    backgroundColor: theme.background.color18,
    borderColor: '#edecec'
  },
  tabLeft: {
    height: '100%',
    borderTopLeftRadius: px(10),
    borderBottomLeftRadius: px(10),
    borderTopWidth: px(2),
    borderLeftWidth: px(2),
    borderBottomWidth: px(2),
  },
  tabRight: {
    height: '100%',
    borderTopRightRadius: px(10),
    borderBottomRightRadius: px(10),
    borderTopWidth: px(2),
    borderRightWidth: px(2),
    borderBottomWidth: px(2),
  },
  unactiveTxt: {
    color: theme.text.color16,
    fontSize: px(25)
  },
  active: {
    backgroundColor: theme.background.colorWhite,
    borderColor: theme.border.colorWhite
    // borderTopLeftRadius: px(10),
    // borderBottomLeftRadius: px(10)
  },
  activeTxt: {
    color: theme.text.color9,
    fontSize: px(25)
  },
  icon: {
    width: px(40),
    height: px(40)
  },
  bg: {
    width: px(640),
    height: px(948)
  },
  membersWp: {
    marginTop: px(26),
    backgroundColor: theme.background.colorWhite
  },
  member: {
    alignItems: 'center'
  },
  shirtNumWp: {
    width: px(40),
    height: px(40),
    backgroundColor: theme.background.colorWhite,
    position: 'absolute',
    top: px(-6),
    left: px(-20),
    borderRadius: px(25),
    opacity: 0.7,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shirtNumTxt: {
    fontSize: px(16),
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    borderWidth: 1
  },
  avatorWp: {
    width: px(60),
    height: px(60),
    // padding: px(5),
    // backgroundColor: theme.background.colorWhite,
    // opacity: 0.5,
    // borderRadius: px(30)
  },
  avatorBg: {
    width: px(60),
    height: px(60),
    padding: px(5),
    backgroundColor: theme.background.colorWhite,
    opacity: 0.5,
    borderRadius: px(30),
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avator: {
    width: px(50),
    height: px(50),
    backgroundColor: theme.background.colorWhite,
    // backgroundColor: 'red',
    borderRadius: px(25),
    opacity: 1,
    position: 'absolute',
    zIndex: 2,
    left: px(5),
    top: px(5)
  },
  nameWp: {
    minWidth: px(92),
    height: px(24),
    backgroundColor: theme.background.color19,
    borderRadius: px(6)
  },
  shadow: {
    width: px(280),
    height: px(75),
    justifyContent: 'center'
  },
  shadowLeft: {
    shadowOffset: { width: px(5), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(5),
    borderTopLeftRadius: px(10),
    borderBottomLeftRadius: px(10),
    backgroundColor: theme.background.colorWhite,
    borderWidth: 0
  },
  shadowRight: {
    shadowOffset: { width: px(5), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(5),
    borderTopRightRadius: px(10),
    borderBottomRightRadius: px(10),
    backgroundColor: theme.background.colorWhite,

  },
  noShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowColor: theme.background.colorWhite,
    shadowRadius: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.background.color18,
  }
});
