import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { Toast, Portal } from '@ant-design/react-native';
import { connect } from 'react-redux';

import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import CheckedNav from '../../components/checked-nav';
import { Row, Col } from '../../components/grid';
import APIs from '../../http/APIs';
import { ShadowBox } from 'react-native-neomorph-shadows';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络
import { enptyFn } from '../../utils/common';
import { dateFormat } from '../../utils/date';

const TAB_TYPE_CONCEDE_POINTS = 1; // 让球
const TAB_TYPE_EXPONENT = 3; // 欧指
const TAB_TYPE_SIZE_BALL = 2; // 大小球
const tabs = [
  {name: '', type: 1, title: '让球', active: true},
  {name: '', type: 3, title: '欧指', active: false},
  {name: '', type: 2, title: '大小球', active: false}
];

const mapState = (state) => {
  return {
    netStatus: state.netInfoModel.netStatus
  };
};

// 一升二降三保持不变
function Exponent(props) {
  const { matchId, socketOdds, dateExponent, netStatus } = props;
  let [type, setType] = React.useState(1);

  const [loading, setLoading] = React.useState(false);
  const [asiaList, setAsiaList] = React.useState([]);
  const [bsList, setBsList] = React.useState([]);
  const [euList, setEuList] = React.useState([]);
  const [europe, setEurope] = React.useState([]);
  let [detailTabsError, setDetailTabsError] = React.useState(false);

  React.useEffect(() => {
    if (socketOdds.asia_list) {
      // console.log('指数 ----- socket', socketOdds);
      changeExponentData(socketOdds);
    }
  }, [socketOdds]);
  const getExponentData = React.useCallback(() => {
    if (!socketOdds.asia_list) {
      let APIsMethod;
      if (dateExponent) {
        const nowDate = dateFormat(new Date());
        if (dateExponent === nowDate) {
          APIsMethod = APIs.getExponentData;
        } else {
          let key = Toast.loading('加载数据中...', 5, enptyFn, false);
          APIs.getExponentDataBefore({
            matchId,
            createDate: dateExponent
          }).then((res) => {
            setLoading(true);
            const dataJson = res;
            if (asiaList.length === 0) {
              changeExponentData(dataJson);
            }
          }).catch((err) => {
            // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
            setDetailTabsError(true);
          })
            .finally((data) => {  
              Portal.remove(key);
            });
          return false;
        }
      } else {
        APIsMethod = APIs.getExponentData;
      }
      let key = Toast.loading('加载数据中...', 5, enptyFn, false);
      APIsMethod({
        matchId
      }).then((res) => {
        setLoading(true);
        // console.log('指数------http', res);
        const dataJson = res.data;
        if (asiaList.length === 0) {
          changeExponentData(dataJson);
        }
      }).catch((err) => {
        // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        setDetailTabsError(true);
      })
        .finally((data) => {  
          Portal.remove(key);
        });
    }
  }, []);
  React.useEffect(() => {
    getExponentData();
  }, [getExponentData]);


  const changeExponentData = React.useCallback((dataJson) => {
    if (dataJson.eu_max && dataJson.eu_min && dataJson.eu_avg) {
      dataJson.eu_max.txtType = 'max';
      dataJson.eu_min.txtType = 'min';
      dataJson.eu_avg.txtType = 'avg';
      setEurope([dataJson.eu_max, dataJson.eu_min, dataJson.eu_avg]);
    }
    if (dataJson.asia_list && dataJson.bs_list && dataJson.eu_list) {
      setAsiaList(dataJson.asia_list);
      setBsList(dataJson.bs_list);
      setEuList(dataJson.eu_list);
    }
  });
  
  const onPress = React.useCallback((tab) => {
    setType(tab.type);
  });
  const TYPECOLOR = React.useCallback((v) => {
    v = String(v);
    switch (v) {
    case '1':
      return styles.txtDualRed;
    case '2':
      return styles.txtGreen;
    default:
      return '';
    }
  });
  const typeTxt = React.useCallback((v) => {
    return (v === 'max' ? '最高' : v === 'avg' ? '平均' : '最低') + '值';
  });

  const netWorkOnPress = React.useCallback(() => {
    setDetailTabsError(false);
    getExponentData();
  }, [getExponentData, setDetailTabsError]);
  return (
    <View style={styles.container}>
      {detailTabsError ? netStatus ? <NetWorkError onPress={netWorkOnPress} /> : <NoInternet /> : <>
        <View style={[cstyle.flexAiC, styles.tabWp]}>
          <CheckedNav navBarTabsConfig={tabs} onPress={onPress} />
        </View>
        <View style={styles.tabContent}>
          {(type === TAB_TYPE_CONCEDE_POINTS || type === TAB_TYPE_SIZE_BALL) && 
          <View style={styles.tabContentInner}>
            {(asiaList.length === 0 || bsList.length === 0) ? 
              loading && <NoDataPlaceHolder msg="暂无相关指数信息" /> : <>
                <Row style={[cstyle.flexDirecR, styles.tbHeader]}>
                  <Col span={4} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>公司</Text></Col>
                  <Col span={10} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>初盘</Text></Col>
                  <Col span={10} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>即时盘</Text></Col>
                </Row>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {(type === TAB_TYPE_CONCEDE_POINTS ? asiaList : bsList).map((item, i) => (
                    <Row key={i} style={styles.dataRow}>
                      <Col span={4}>
                        <Text style={[styles.txtBlack, cstyle.txtC]}>{item.companyName}</Text>
                        <View style={styles.line}></View>
                      </Col>
                      <Col span={10} style={cstyle.flexDirecR}>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.homeOdds}</Text>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.tieOdds}</Text>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.awayOdds}</Text>
                        <View style={[styles.line, {right: px(20)}]}></View>
                      </Col>
                      <Col span={10} style={cstyle.flexDirecR}>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray, TYPECOLOR(item.realHomeOddsTrend)]}>{item.realHomeOdds}</Text>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray, TYPECOLOR(item.realTieOddsTrend)]}>{item.realTieOdds}</Text>
                        <Text style={[styles.mw80, cstyle.txtC, styles.txtGray, TYPECOLOR(item.realAwayOddsTrend)]}>{item.realAwayOdds}</Text>
                        <View style={[cstyle.flexAiC, cstyle.flexJcC, cstyle.posAbs, styles.rowArrow]}>
                          <View style={styles.arrowR}></View>
                        </View>
                      </Col>
                    </Row>
                  ))}
                </ScrollView>
              </>
            }
          </View>}
          {type === TAB_TYPE_EXPONENT && 
          <View style={styles.tabContentInner}>
            <ScrollView style={styles.scrollView}>
              {europe.length !== 0 && <ShadowBox
                // inner // <- enable inner shadow
                useSvg // <- set this prop to use svg on ios
                style={{
                  shadowOffset: {width: px(5), height: px(10)},
                  shadowOpacity: theme.shadowOpacity,
                  shadowColor: theme.shadowColor,
                  shadowRadius: px(10),
                  borderRadius: px(20),
                  backgroundColor: theme.background.colorWhite,
                  width: px(710),
                  height: px(400),
                }}
              >
                <View>
                  {europe && europe.map((item, i) => (
                    <View style={[cstyle.flexDirecR, cstyle.flexAiC, styles.tb2TopDataRow]} key={i}>
                      <View style={[styles.mw140, cstyle.flexJcC]}>
                        <Text style={[styles.txtBlack, cstyle.fz24, cstyle.txtC]}>{typeTxt(item.txtType)}</Text>
                        <View style={[styles.line, {height: px(82)}]}></View>
                      </View>
                      <View>
                        <View style={cstyle.flexDirecR}>
                          <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>初盘</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.home_init}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tie_init}</Text>
                          <Text style={[styles.txtGray, cstyle.fz22]}>{item.away_init}</Text>
                        </View>
                        <View style={styles.euStyle}>
                          <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>即盘</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray, TYPECOLOR(item.home_real_trend)]}>{item.home_real}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray, TYPECOLOR(item.tie_real_trend)]} >{item.tie_real}</Text>
                          <Text style={[styles.txtGray, cstyle.fz22, TYPECOLOR(item.away_real_trend)]}>{item.away_real}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ShadowBox>}
              {euList.length === 0 ? loading && europe.length === 0 ? <NoDataPlaceHolder msg="暂无相关指数信息" /> : null
                : <View>
                  <View style={[cstyle.flexDirecR, styles.tb2Header, cstyle.flexAiC]}>
                    <View><Text style={[styles.tbHeaderTxt, cstyle.txtC, styles.mw140]}>公司</Text></View>
                    <View style={[cstyle.flexDirecR, styles.tbHeaderR]}>
                      <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>主胜</Text></View>
                      <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>平局</Text></View>
                      <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>客胜</Text></View>
                    </View>
                  </View>
                  {euList.map((item, i) => (
                    <View style={[cstyle.flexDirecR, cstyle.flexAiC, styles.tb2DataRow]} key={i}>
                      <View style={[styles.mw140, cstyle.flexJcC]}>
                        <Text style={[styles.txtBlack, cstyle.fz22, cstyle.txtC]}>{item.companyName}</Text>
                        <View style={[styles.line, {height: px(82)}]}></View>
                      </View>
                      <View>
                        <View style={cstyle.flexDirecR}>
                          <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>初盘</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.homeOdds}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tieOdds}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.awayOdds}</Text>
                        </View>
                        <View style={styles.euStyle}>
                          <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>即盘</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray, TYPECOLOR(item.realHomeOddsTrend)]}>{item.realHomeOdds}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray, TYPECOLOR(item.realTieOddsTrend)]} >{item.realTieOdds}</Text>
                          <Text style={[styles.mw110, cstyle.fz22, styles.txtGray, TYPECOLOR(item.realAwayOddsTrend)]}>{item.realAwayOdds}</Text>
                        </View>
                      </View>
                      <View>
                        <View style={styles.arrowR}></View>
                      </View>
                    </View>
                  ))}
                </View>}
            </ScrollView>  
          </View>}
        </View>
      </>}
    </View>
  );
}

export default connect(mapState)(Exponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.screenBgColor,
  },
  tabWp: {
    paddingTop: px(20),
    paddingBottom: px(18)
  },
  scrollView: {
    paddingBottom: px(80),
  },
  tabContent: {
    flex: 1,
  },
  tabContentInner: {
    paddingLeft: px(20),
    paddingRight: px(20)
  },
  tbHeaderTxt: {
    fontSize: px(20),
    color: theme.text.color17,
  },
  tbHeader: {
    backgroundColor: theme.background.colorWhite
  },
  dataRow: {
    height: px(74),
    backgroundColor: theme.background.colorWhite,
    marginBottom: px(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  tb2TopDataRow: {
    height: px(130),
    backgroundColor: theme.background.colorWhite,
  },
  tb2DataRow: {
    height: px(130),
    backgroundColor: theme.background.colorWhite,
    borderRadius: px(10),
    marginBottom: px(10),
    borderWidth: px(2),
    borderColor: theme.border.color8
  },
  mw80: {
    minWidth: px(80)
  },
  mw140: {
    minWidth: px(140)
  },
  mw120: {
    minWidth: px(120)
  },
  mw110: {
    minWidth: px(110)
  },
  tb2Header: {
    height: px(60),
    marginBottom: px(10),
    marginTop: px(20)
  },
  tbHeaderR: {
    paddingLeft: px(120)
  },
  txtBlack: {
    color: theme.text.color18,
    fontSize: px(22)
  },
  txtGray: {
    color: theme.text.color13
  },
  txtGreen: {
    color: theme.text.color19
  },
  txtDualRed: {
    color: theme.text.color20
  },
  arrowR: {
    width: px(12),
    height: px(12),
    borderTopWidth: px(2),
    borderRightWidth: px(2),
    borderColor: theme.border.color9,
    transform: [
      {rotate: '45deg'}
    ]
  },
  rowArrow: {
    height: px(36),
    right: px(20)
  },
  line: {
    height: px(42),
    borderLeftWidth: px(2),
    borderColor: theme.border.color8,
    position: 'absolute',
    right: 0
  },
  euStyle: {
    flexDirection: 'row',
    marginTop: px(20)
  }
});
