import React, { PureComponent } from 'react';
import { 
  StyleSheet, 
  Text,  
  View,
  Image,
  SectionList
} from 'react-native';
import _ from 'lodash';
import { Toast, Portal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview';

import { enptyFn } from '../../utils/common';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import { dateFormat } from '../../utils/date';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络

const winLoseRemark = [
  {key: '1', remark: '主胜', txtColor: {color: theme.text.color22}},
  {key: '2', remark: '和局', txtColor: {color: theme.text.color6}},
  {key: '3', remark: '客胜', txtColor: {color: theme.text.color24}}
];

const mapState = (state) => {
  return {
    netStatus: state.netInfoModel.netStatus
  };
};

class InfosComponent extends PureComponent {
  page = 0;
  constructor(props) {
    super(props);
    this.state = {
      historyDatas: [],
      recentDatas: [],
      isBeLoaded: true, // 加载更多，暂未使用
      detailTabsError: false 
    };
  }

  UNSAFE_componentWillMount() {
    this.initData();
  }

  initData = () => {
    this.getRecentData();
    this.getHistoryData();
  };

  // 请求交封战绩数据
  getRecentData = () => {
    const { isBeLoaded } = this.state;
    if (!isBeLoaded) return false;
    const { awayId, homeId, homeLogo, homeNameZh, awayLogo, awayNameZh } = this.props;
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getDetailDataRecent({
      awayId,
      homeId,
      page: this.page,
      size: 10
    }).then((res) => {
      if (res[awayId] || res[homeId]) {
        const awayIdLength = res[awayId] ? res[awayId].length : 0;
        const homeIdLength = res[homeId] ? res[homeId].length : 0;
        const dataJson = Object.keys(res).map((item) => {
          if (item == homeId) {
            return {
              logo: homeLogo,
              nameZh: homeNameZh,
              id: homeId,
              data: res[item]
            };
          } else if (item == awayId) {
            return {
              logo: awayLogo,
              nameZh: awayNameZh,
              id: awayId,
              data: res[item]
            };
          }
        });
        this.setState(() => ({
          recentDatas: dataJson,
          isBeLoaded: (awayIdLength + homeIdLength) <= 10 ? false : true
        }));
      }
    }).catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
      this.setState(() => ({
        detailTabsError: true
      }));
    }).finally((data) => {
      this.page++;
      Portal.remove(key);
    });
  }; 

  // 请求历史交锋数据
  getHistoryData = () => {
    const {awayId, homeId} = this.props;
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getDetailDataHistory({
      awayId,
      homeId,
      page: 0,
      size: 10
    }).then((res) => {
      if (res && typeof res.length == 'number') {
        this.setState(() => ({
          historyDatas: res
        }));
      }
    }).catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
      this.setState(() => ({
        detailTabsError: true
      }));
    }).finally((data) => {  
      Portal.remove(key);
    });
  }

  competetionRsStatus = (v) => {
    const vString = String(v);
    const winLose = _.find(winLoseRemark, (item) => (item.key === vString));
    return winLose ? winLose.remark : '';
  };
  isWin = (v) => {
    const vString = String(v);
    return vString === '1';
  };
  isWinBack = (v) => {
    const vString = String(v);
    return vString === '3';
  };
  rsStatusTxtColor = (v) => {
    const vString = String(v);
    const winLose = _.find(winLoseRemark, (item) => (item.key === vString));
    return winLose ? winLose.txtColor : {color: theme.text.color6};
  };
  // 截取全场比分
  splitScore = (v, isHomeTeam) => {
    const vString = String(v).split('-');
    return isHomeTeam ? vString[0] : vString[1];
  };

  get _listHeaderComponent () {
    const {historyDatas, recentDatas} = this.state;
    return (
      <>
        {historyDatas.length > 0 && 
        <View style={styles.historyStyle}>
          <View style={cstyle.flexDirecR}>
            <View style={styles.typeTitleWp}>
              <Text style={[styles.txtGreen, styles.bdGreen, styles.typeTitle]}>历史交锋</Text>
            </View>
            {/* <View style={[cstyle.flex1, cstyle.flexDirecR, cstyle.flexJcFe]}>
              <TouchableOpacity 
                activeOpacity={theme.clickOpacity} 
                style={[styles.btn, styles.bgGreen]} 
                onPress={sameHomeAndAway}
              >
                <Text style={[styles.btnTxt, styles.txtGreen]}>主客相同</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={[cstyle.flexDirecR, styles.tbHeader]}>
            <View style={[styles.td1, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>日期/赛事</Text></View>
            <View style={[styles.td2, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>主队</Text></View>
            <View style={[styles.td3, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>比分</Text></View>
            <View style={[styles.td4, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>客队</Text></View>
            <View style={[styles.td5, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>胜负</Text></View>
          </View>
          <CardView
            cardElevation={px(8)}
            cardMaxElevation={px(8)}
            style={styles.shadowBox}
          >
            <View style={styles.listWp}>
              {historyDatas.map((item, i) => (
                <View style={[cstyle.flexDirecR, styles.tbRow]} key={i}>
                  <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC, styles.tbRowInner, historyDatas.length - 1 !== i ? styles.bdb : {}]}>
                    <View style={styles.td1}>
                      <Text style={[styles.txtGray, cstyle.fz24]}>{item.createTime && dateFormat(item.createTime * 1000)}</Text>
                      <Text style={styles.matchNameStyle}>{item.matchName}</Text>
                    </View>
                    <View style={[styles.td2, cstyle.flexAiC]}>
                      <Text style={[cstyle.fz22, this.isWin(item.winOrLose) ? styles.txtRed : styles.undefined]}>{item.homeNmae}</Text>
                    </View>
                    <View style={[styles.td3, cstyle.flexAiC]}>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={[cstyle.fz22, this.isWin(item.winOrLose) ? styles.txtRed : styles.undefined]}>{this.splitScore(item.finallyScore, true)}</Text>
                        <Text style={cstyle.fz22}>-</Text>
                        <Text style={[cstyle.fz22, this.isWinBack(item.winOrLose) ? styles.txtRed : styles.undefined]}>{this.splitScore(item.finallyScore, false)}</Text>
                      </View>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={styles.halfScoreStyle}>({item.halfScore})</Text>
                      </View>
                    </View>
                    <View style={[styles.td4, cstyle.flexAiC]}>
                      <Text style={[cstyle.fz22, this.isWinBack(item.winOrLose) ? styles.txtRed : styles.undefined]}>{item.awayName}</Text>
                    </View>
                    <View style={[styles.td5, cstyle.flexAiC, styles.Td5PaddingLeft]}>
                      {/* <Text style={[cstyle.fz22, rsStatusTxtColor(item.winLose)]}>{item.odds}</Text> */}
                      <Text style={[cstyle.fz22, this.rsStatusTxtColor(item.winOrLose)]}>{this.competetionRsStatus(item.winOrLose)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CardView>
        </View>}
        {recentDatas.length > 0 && 
        <View style={styles.recentStyle}>
          <View style={cstyle.flexDirecR}>
            <View style={styles.typeTitleWp}>
              <Text style={[styles.txtGreen, styles.bdGreen, styles.typeTitle]}>近期战绩</Text>
            </View>
            {/* <View style={[cstyle.flex1, cstyle.flexDirecR, cstyle.flexJcFe]}>
              <TouchableOpacity activeOpacity={theme.clickOpacity} style={[styles.btn, styles.bgRed, cstyle.mgR20]}>
                <Text style={[styles.btnTxt, styles.txtRed]}>同主客</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={theme.clickOpacity} style={[styles.btn, styles.bgLeafGreen]}>
                <Text style={[styles.btnTxt, styles.txtLeafGreen]}>同赛事</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>}
      </>
    );
  }

  get _listFooterComponent () {
    const { isBeLoaded, recentDatas } = this.state;
    if (recentDatas.length === 0) return null;
    return (
      isBeLoaded ? <Text style={styles.ListFooterComponentStyle}>正在加载中...</Text> : 
        recentDatas.length > 6 ? <Text style={styles.ListFooterComponentStyle}>没有更多数据了...</Text> : null
    );
  }

  _renderItem = ({item, index}) => {
    return (
      <CardView
        cardElevation={px(8)}
        cardMaxElevation={px(8)}
        style={styles.recentShadowBox}
      >
        <View style={styles.listWp}>
          <View style={[cstyle.flexDirecR, styles.tbRow]} key={index}>
            <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC, styles.tbRowInner]}>
              <View style={styles.td1}>
                <Text style={[styles.txtGray, cstyle.fz24]}>{item.createTime && dateFormat(item.createTime * 1000)}</Text>
                <Text style={styles.matchNameStyle}>{item.matchName}</Text>
              </View>
              <View style={[styles.td2, cstyle.flexAiC]}>
                <Text style={[cstyle.fz22, this.isWin(item.winOrLose) ? styles.txtRed : styles.undefined]}>{item.homeNmae}</Text>
              </View>
              <View style={[styles.td3, cstyle.flexAiC]}>
                <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                  <Text style={[cstyle.fz22, this.isWin(item.winOrLose) ? styles.txtRed : styles.undefined]}>{this.splitScore(item.finallyScore, true)}</Text>
                  <Text style={cstyle.fz22}>-</Text>
                  <Text style={[cstyle.fz22, this.isWinBack(item.winOrLose) ? styles.txtRed : styles.undefined]}>{this.splitScore(item.finallyScore, false)}</Text>
                </View>
                <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                  <Text style={styles.halfScoreStyle}>({item.halfScore})</Text>
                </View>
              </View>
              <View style={[styles.td4, cstyle.flexAiC]}>
                <Text style={[cstyle.fz22, this.isWinBack(item.winOrLose) ? styles.txtRed : styles.undefined]}>{item.awayName}</Text>
              </View>
              <View style={[styles.td5, cstyle.flexAiC, styles.Td5PaddingLeft]}>
                {/* <Text style={[cstyle.fz22, rsStatusTxtColor(item.winLose)]}>{item.odds}</Text> */}
                <Text style={[cstyle.fz22, this.rsStatusTxtColor(item.winOrLose)]}>{this.competetionRsStatus(item.winOrLose)}</Text>
              </View>
            </View>
          </View>
        </View>
      </CardView>
    );
  };

  _renderSectionHeader =({ section: { logo, nameZh } }) => {
    return(
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {logo ? <Image style={styles.headerImage} source={{uri: logo}} /> : null}
          <Text style={styles.headerText}>{nameZh}</Text>
        </View>
        <View style={[cstyle.flexDirecR, styles.tbHeader, styles.sectionHeaderStyle]}>
          <View style={[styles.td1, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>日期/赛事</Text></View>
          <View style={[styles.td2, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>主队</Text></View>
          <View style={[styles.td3, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>比分</Text></View>
          <View style={[styles.td4, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>客队</Text></View>
          <View style={[styles.td5, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>胜负</Text></View>
        </View>
      </View>
    );
  };

  _renderSectionFooter = () => {
    return (<View style={styles.sectionFooter}></View>);
  };

  _onEndReached = () => {
    this.getRecentData();
  };

  _keyExtractor = (item, index) => {
    return index + '';
  };

  netWorkOnPress = () => {
    this.setState(() => ({
      detailTabsError: false
    }));
    this.initData();
  };

  render () {
    const { recentDatas, historyDatas, detailTabsError } = this.state;
    const {netStatus} = this.props;
    return (
      detailTabsError ? netStatus ? <NetWorkError onPress={this.netWorkOnPress} /> : <NoInternet /> : (historyDatas.length === 0 && recentDatas.length === 0) ? 
        <NoDataPlaceHolder msg="暂无相关往绩信息" /> :
        <SectionList
          sections={recentDatas}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          ListHeaderComponent={this._listHeaderComponent}
          renderSectionFooter={this._renderSectionFooter}
          contentContainerStyle={styles.container}
          extraData={historyDatas}
          stickySectionHeadersEnabled={false}
        />
    );
  }
}

export default connect(mapState)(InfosComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.screenBgColor,
  },
  historyStyle: {
    paddingHorizontal: px(20),
    paddingTop: px(20)
  },
  recentStyle: {
    paddingTop: px(20),
    paddingHorizontal: px(20)
  },
  txtRed: {
    color: theme.text.color22
  },
  txtGreen: {
    color: theme.text.color24
  },
  txtLeafGreen: {
    color: theme.text.color23
  },
  txtDeepGreen: {
    color: theme.text.color19
  },
  txtGray: {
    color: theme.text.color25
  },
  txtBlue: {
    color: theme.text.color6
  },
  bdRed: {
    borderColor: theme.border.color10
  },
  bdGreen: {
    borderColor: theme.border.color11
  },
  bdLeafGreen: {
    borderColor: theme.border.color12
  },
  bgRed: {
    backgroundColor: theme.background.color16
  },
  bgGreen: {
    backgroundColor: theme.background.color15
  },
  bgLeafGreen: {
    backgroundColor: theme.background.color17
  },
  typeTitleWp: {
    width: '50%'
  },
  typeTitle: {
    borderLeftWidth: px(6),
    paddingLeft: px(20),
    fontSize: px(26)
  },
  btn: {
    minWidth: px(90),
    height: px(30),
    borderRadius: px(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTxt: {
    fontSize: px(18),
  },
  tbHeaderTxt: {
    fontSize: px(18),
    color: theme.text.color17,
  },
  tbHeader: {
    // backgroundColor: theme.background.colorWhite
    marginTop: px(10)
  },
  td1: {
    width: '25%'
  },
  td2: {
    width: '20%'
  },
  td3: {
    width: '15%'
  },
  td4: {
    width: '22%'
  },
  td5: {
    width: '18%'
  },
  Td5PaddingLeft: {
    paddingLeft: px(24)
  },
  listWp: {
    minHeight: px(120),
    // borderWidth: px(2),
    // borderColor: theme.border.color8,
    // borderColor: 'red',
    borderLeftWidth: px(2),
    borderRightWidth: px(2),
    borderColor: theme.border.color8,
    marginTop: px(10)
  },
  contentContainerStyle: {
    padding: px(20),
    marginBottom: px(20)
  },
  tbRow: {
    height: px(140),
    alignItems: 'center',
    // backgroundColor: theme.background.colorWhite,
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  tbRowInner: {
    height: '100%'
  },
  bdb: {
    borderBottomWidth: px(2),
    borderColor: theme.border.color3
  },
  shadowBox: {
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(20),
    // paddingRight: px(20),
    marginBottom: px(30),
    marginTop: px(10)
  },
  recentShadowBox: {
    marginHorizontal: px(20)
  },
  other: {
    width: '100%'
  },
  undefined: {},
  ListFooterComponentStyle: {
    color: theme.text.color8,
    marginVertical: px(30),
    textAlign: 'center'
  },
  section: {
    marginBottom: px(10)
  },
  sectionHeader: {
    borderBottomColor: theme.border.color3,
    borderBottomWidth: px(2),
    height: px(72),
    paddingHorizontal: px(40),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerImage: {
    width: px(40),
    height: px(40)
  },
  headerText: {
    marginLeft: px(13),
    fontSize: px(25),
    color: theme.text.color9
  },
  sectionFooter: {
    marginBottom: px(30)
  },
  sectionHeaderStyle: {
    paddingHorizontal: px(20)
  },
  matchNameStyle: {
    fontSize: px(22),
    color: theme.text.color13
  },
  halfScoreStyle: {
    fontSize: px(20),
    color: theme.text.color13
  }
});

