import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  RefreshControl,
  BackHandler,
  AppState,
  TouchableHighlightBase,
  DeviceEventEmitter,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Tabs, Button, Toast, Portal, Modal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import AppActions from '../../store/actions';
import {
  GameTypes,
  CompetitionFootballEventTypes,
  CompetitionListItemTypes,
  SocketDataMsgType,
  OffOutNews
} from '../../utils/constant';
import Header from './Header';
import { px, winHeight } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import ListItem from '../../components/competition-list-item';
import WeekHeader, { getCurDate } from '../../components//week-header';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import BackTop from '../../components/back-top';
import Reminder from '../../components/competition-reminder';
import APIs from '../../http/APIs';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { processNetworkException } from '../../http';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络
// import { ONE_DAY } from '../../utils/date';
import Badge from '../../components/badge';
// import MyWebSocket from '../../socket';
import NoMoreData from '../../components/no-more-data';
import MatchFilter from '../../components/match-filter';
import { withWrapTeleport } from '../../components/portal';
// import { /* filterTabs, typesData, */ typesData1 } from './data';
import { ShadowBox } from 'react-native-neomorph-shadows';
import EventBus from '../../utils/eventBus';
import { enptyFn } from '../../utils/common';
import { getUniqueId } from 'react-native-device-info';
import { getMatchStatus, MatchStaus } from '../../utils/matchCommon';
import axios, { CancelToken } from 'axios';
import { formatFilterData } from './matchFilter';
import store from '../../store';
import { socketDataArrayToObject, objectsOfPropToObjectsOfArray } from '../../utils/socketDataMapping';

// import { curEvn, EVN_DEV, EVN_TEST } from '../../../config';
const IMAGE_BASE_DIR = '../../assets/images/';

const devideId = getUniqueId();
const mapState = (state) => ({
  state,
  netStatus: state.netInfoModel.netStatus,
  dataError: state.netInfoModel.dataError
});
function showToast(text) {
  Toast.info(text, 3, enptyFn, false);
}
const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
  updataDataError: AppActions.updataDataError
};

const StatusTab = {
  ALL: 0,
  IN_PLAY: 1,
  AGENDA: 2,
  ENDS: 3,
  FAVOURITE: 4,
};

const imageFilter = require(IMAGE_BASE_DIR + 'icon-filter.png');
const imageSetting = require(IMAGE_BASE_DIR + 'icon-setting.png');

function HeaderLeft(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
        style={[cstyle.w100, cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}
      >
        <Image source={imageFilter} style={styles.headerLeftImage} />
      </TouchableOpacity>
    </View>
  );
}

function HeaderRight(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
      >
        <Image source={imageSetting} style={styles.headerRightImage} />
      </TouchableOpacity>
    </View>
  );
}

function MyContentLoading(props) {
  return Array.from({ length: 8 }).map((n, i) => (
    <View style={theme.skeletonBdB} key={i}>
      <ContentLoader
        height={80}
        width={px(700)}
        speed={2}
        viewBox={`0 0 ${px(700)} 80`}
        backgroundColor={theme.skeletonItemBgColor}
        foregroundColor={theme.skeletonItemForegroundColor}
        {...props}
      >
        <Rect x="15" y="15" rx="4" ry="4" width="130" height="10" />
        <Rect x="155" y="15" rx="3" ry="3" width="130" height="10" />
        <Rect x="295" y="15" rx="3" ry="3" width="90" height="10" />
        <Rect x="15" y="50" rx="3" ry="3" width="90" height="10" />
        <Rect x="115" y="50" rx="3" ry="3" width="60" height="10" />
        <Rect x="185" y="50" rx="3" ry="3" width="200" height="10" />
        <Rect x="15" y="90" rx="3" ry="3" width="130" height="10" />
        <Rect x="160" y="90" rx="3" ry="3" width="120" height="10" />
        <Rect x="290" y="90" rx="3" ry="3" width="95" height="10" />
      </ContentLoader>
    </View>
  ));
}

function CommonResult(props) {
  const {
    loading = true,
    noData = false,
    timeout,
    noDataMsg = '暂无相关比分',
    noDataType,
    networkErrStyle = styles.networkErr,
    onPress,
    noDataOnPress,
  } = props;
  if (loading) {
    return <MyContentLoading />;
  } else if (StatusTab.FAVOURITE != noDataType && noData) {
    return <NoDataPlaceHolder msg={noDataMsg} />;
  } else if (StatusTab.FAVOURITE === noDataType && noData) {
    return (
      <NoDataPlaceHolder msg="暂未关注 快去看您可能想看的比分">
        <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
          <Button
            type="primary"
            size="small"
            activeStyle={false}
            onPress={noDataOnPress}
            style={styles.noDataBtn}
          >
            <Text>去看看</Text>
          </Button>
        </View>
      </NoDataPlaceHolder>
    );
  } else if (timeout) {
    return <NetWorkError style={networkErrStyle} onPress={onPress} />;
  } else {
    return <></>;
  }
}

function WrapperMatchFilter(props) {
  if (props.showFilter === false) return <></>;
  return <MatchFilter {...props} />;
}

const notiyEvtTypes = [
  CompetitionFootballEventTypes.RED_CARD,
  CompetitionFootballEventTypes.GOAL_IN,
];

class Competition extends React.Component {
  curTabContentEl;
  refContent;
  socket;
  matchListLoadingKey;
  updateFavLoadingKey;
  updateFavRsLoadingKey;
  showsVerticalScrollIndicator = false;
  INITIAL_NUM_TO_RENDER = 10;
  ROW_HEIGHT = px(142);
  LIST_WINDOW_SIZE = 50;
  removeClippedSubviews = true;
  tabRef = null;
  footballTabTypeMapping = [
    CompetitionListItemTypes.ALL,
    CompetitionListItemTypes.IN_PLAY,
    CompetitionListItemTypes.AGENDA,
    CompetitionListItemTypes.ENDS,
    CompetitionListItemTypes.FAVOURITE,
  ];
  today = getCurDate();
  END_REACHED_THRESHOLD = 4;
  constructor(props) {
    super(props);
    let commonTab = {
      data: [],
      page: 0,
      totalPage: 1,
      noData: false,
      loading: true,
      timeout: false,
      loadMore: true,
    };
    let date = this.today;
    let tabs = [
      Object.assign({ title: '全部', index: StatusTab.ALL }),
      Object.assign({ title: '进行中', index: StatusTab.IN_PLAY }),
      Object.assign({ title: '赛程', index: StatusTab.AGENDA, date }),
      Object.assign({ title: '赛果', index: StatusTab.ENDS, date }),
      Object.assign({ title: '关注', index: StatusTab.FAVOURITE }),
    ];
    let statusTabs = [
      Object.assign({ index: StatusTab.ALL }, commonTab),
      Object.assign({ index: StatusTab.IN_PLAY }, commonTab),
      Object.assign(
        { index: StatusTab.AGENDA, date, updateFlag: Date.now() },
        commonTab
      ),
      Object.assign(
        { index: StatusTab.ENDS, date, updateFlag: Date.now() },
        commonTab
      ),
      Object.assign({ index: StatusTab.FAVOURITE }, commonTab),
    ];
    this.state = {
      gameType: GameTypes.FOOTBALL,
      showFilter: false,
      unReadCount: 0,
      tabs,
      statusTabs,
      initialPage: 0,
      page: 0,
      tabsConfig: {
        swipeable: true,
        useOnPan: true,
        usePaged: true,
        // swipeable: false,
        // useOnPan: false,
        // usePaged: false
      },
      reminders: [],
      showBackTop: false,
      error: '',
      typesData: [],
      filterTabs: [],
      containerHeight: winHeight,
      matchFilterParams: [],
      showTabs: true,
      refreshing: false
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: (props) => <HeaderLeft onPress={this.navBarLeftHandler} />,
      headerTitle: (props) => (
        <Header onPress={this.navBarTabsHandler} canSwitch={false} {...props} />
      ),
      headerRight: (props) => <HeaderRight onPress={() => { }} />,
    });
    // this.getMatchList(false);
    // 暂时屏蔽筛选 20200818
    // setTimeout(() => {
    this.getTabsOfMatchFilter();
    // });
    EventBus.addListenser('evtMatchIndexFromGoBack', ({ id, fav }) => {
      this.updateMatchItemFavouriteStatus(id, fav);
    });

    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', (e) => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButtonPressAndroid
        );
        this.displayTabs();
      });
      this.props.navigation.addListener('blur', (e) => {
        Portal.remove(this.matchListLoadingKey);
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackButtonPressAndroid
        );
        this.hideTabs();
      });
    }
    AppState.addEventListener('change', this.handleAppStateChange);
    this.showFooterTabBar();
    // console.log('competition componentDidMount', this.props.state.footerTabBar.show);
  }
  init() {
    let statusTabs = this.state.statusTabs;
    statusTabs = statusTabs.map((tab) => {
      tab.noData = false;
      tab.data = [];
      if ([StatusTab.AGENDA, StatusTab.ENDS].includes(tab.index)) {
        tab.date = this.today;
      }
      return tab;
    });
    let curTab = statusTabs[this.state.page];
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.data = [];
    curTab = this.resetLoadMoreStatus(curTab);
    this.setState({ showBackTop: false, statusTabs }, () => {
      this.getMatchList(false);
    });
  }

  async displayTabs() {
    await DeviceEventEmitter.emit('thisIdStopPlaying', OffOutNews.OFF_OUT_NEWS);
    await this.init();
    await this.setState({ showTabs: true });
  }

  hideTabs() {
    this.setState({ showTabs: false });
  }

  handleAppStateChange = (state) => {
    if (state === 'active' && this.props.navigation.isFocused()) {
      console.log('info handleAppStateChange active');
      this.state.reminders.forEach((item) => {
        this.reminderShowEnd(item.matchId);
      });
      this.displayTabs();
      // this.showFooterTabBar();
    } else if (state === 'inactive') {
      this.hideTabs();
    }
  };

  showFooterTabBar = () => {
    if (this.props.state?.footerTabBar?.show === false) {
      this.props.updateFooterTabBar({ show: true });
    }
  }

  handleBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
      Modal.alert('确认', '您确定要退出吗？', [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
    }
    return true;
  };

  // 赛事筛选完成
  filterHandler = async () => {
    await this.props.teleport('home', <WrapperMatchFilter showFilter={false} />);
    await this.setState({ showFilter: false });
    await this.displayTabs();
  };

  // 赛事筛选
  navBarLeftHandler = async () => {
    const {
      props:{
        dataError,
        netStatus
      }
    } = this;
    if(dataError && netStatus) {
      Toast.offline('网络异常，请稍后再试');
      return;
    }
    if (!this.state.filterTabs || this.state.filterTabs.length < 1) return;
    await this.props.teleport(
      'home',
      <WrapperMatchFilter
        close={this.filterHandler}
        typesData={this.state.typesData}
        tabsData={this.state.filterTabs}
        updateTypesData={this.updateTypesData}
      />
    );
    await this.setState({ showFilter: true });
    await this.hideTabs();
  };

  updateTypesData = (ids) => {
    this.setState({ matchFilterParams: ids }, () => {
      this.refreshMatchList();
    });
  };

  // 足球、篮球切换
  navBarTabsHandler = (tab) => {
    // TODO 篮球功能未实现，暂时不进行切换
    // return;
    // console.log('navBarTabsHandler = ', tab);
    this.setState({ gameType: tab.name }, () => {
      this.init();
    });
  };

  // tabs列表切换
  tabHandler = (tab, index) => {
    if (index === this.state.page) return;
    const { updataDataError } = this.props;
    updataDataError(false);
    switch (index) {
    case StatusTab.IN_PLAY:
      break;
    case StatusTab.FAVOURITE:
      if (this.state.unReadCount > 0) {
        this.updateUnreadCount(0);
      }
      break;
    default:
      break;
    }
    let statusTabs = this.state.statusTabs;
    statusTabs = statusTabs.map((tab) => {
      tab.noData = false;
      tab.timeout = false;
      tab.data = [];
      if ([StatusTab.AGENDA, StatusTab.ENDS].includes(tab.index)) {
        tab.date = this.today;
        tab.updateFlag = Date.now();
      }
      return tab;
    });
    let curTab = statusTabs[this.state.page];
    curTab.noData = false;
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.data = [];
    curTab = this.resetLoadMoreStatus(curTab);
    
    this.setState(
      { page: index, showBackTop: false, statusTabs },
      // { page: index, showBackTop: false, statusTabs, matchFilterParams: [] },
      () => {
        this.getMatchList(false);
      }
    );
  };

  /**
   * 获取赛事筛选菜单
   */
  getTabsOfMatchFilter() {
    const gameType = this.state.gameType;
    const type = gameType === GameTypes.FOOTBALL ? 1 : 2;
    APIs.getTabsOfMatchFilter({ type }).then((res) => {
      if (res) {
        let { categoryList, footballEventTList } = res;
        categoryList = categoryList.map((item) => {
          item.title = item.categoryName;
          return item;
        });
        categoryList.unshift({
          category_name: '完整',
          id: 0,
          categoryName: '完整',
          status: 1,
          leagueCategoryId: 1,
          title: '完整',
        });
        this.getTabTypesOfMatchFilter(categoryList, footballEventTList || []);
      }
    }).catch((err) => {
      // showToast('网络异常，请稍后再试');
    });
  }

  /**
   * 获取赛事筛选菜单下面的数据
   */
  getTabTypesOfMatchFilter(filterTabs, footballEventTList) {
    // APIs.getTabTypesOfMatchFilter().then((res) => {
    // console.log(res);
    // let {footballEventTList} = filterTabs;
    if (footballEventTList) {
      footballEventTList = footballEventTList.map((item) => {
        item.checked = true;
        return item;
      });
      this.setState({ filterTabs: formatFilterData(filterTabs, footballEventTList) });
    }
    // });
  }

  // 进入赛事全部
  gotoAllCompetition = () => {
    if (this.tabRef) {
      this.tabRef.scrollTo(0);
    }
    this.tabHandler({}, StatusTab.ALL);
  };

  // 赛程日期
  weekHeaderHandler = (wd, i) => {
    let statusTabs = this.state.statusTabs;
    let curTab = statusTabs[this.state.page];
    curTab.noData = false;
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.date = wd.date;
    curTab.loadMore = true;
    curTab.data = [];
    this.setState({ statusTabs }, this.getMatchList(false));
  };

  // 更新关注未读
  updateUnreadCount(unReadCount) {
    this.setState({ unReadCount }, () => {
      let tabs = this.state.tabs;
      tabs.map((tab) => {
        if (tab.index === StatusTab.FAVOURITE) {
          tab.title = (
            <Badge text={unReadCount}>
              <Text style={styles.badgeTabTxt}>关注</Text>
            </Badge>
          );
        }
        return tab;
      });
      this.setState({ tabs });
    });
  }

  /**
   * 更新收藏状态(添加、删除)
   * @param id 比赛ID
   * @param fav 当前收藏状态(收藏:y, 未收藏: n)
   */
  updateFavourite = (id, fav) => {
    // Portal.remove(this.updateFavRsLoadingKey);
    Portal.remove(this.updateFavLoadingKey);
    // this.updateFavLoadingKey = Toast.loading('处理中...', 0, enptyFn, false);
    let mId = store.getState().login.loginInfo.id
      ? store.getState().login.loginInfo.id
      : '';
    // console.log(`用户id===${mId}`)
    let obj = mId
      ? { matchId: id, memberId: mId, deviceId: devideId }
      : { matchId: id, deviceId: devideId };
    let pfav;
    if ('y' === fav) {
      APIs.cancelFavourite(obj)
        .then((res) => {
          if ('000' === res.statusCode) {
            pfav = 'n';
            // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
            let unReadCount = this.state.unReadCount;
            let statusTabs;
            let found = -1;
            --unReadCount;
            if (unReadCount < 0) unReadCount = 0;
            // 关注TAB页，取消则删除
            if (this.state.page === StatusTab.FAVOURITE) {
              unReadCount = 0;
              statusTabs = this.state.statusTabs.map((item) => {
                if (StatusTab.FAVOURITE === item.index) {
                  found = item.data.findIndex((d) => d.id === id);
                  if (found > -1) item.data.splice(found, 1);
                  if (item.data.length < 1) {
                    item.noData = true;
                    item.loading = false;
                  }
                }
                return item;
              });
              this.setState({ statusTabs });
            } else {
              this.updateMatchItemFavouriteStatus(id, pfav);
            }
            // console.log('updateFavourite res', res, pfav, fav, unReadCount, this.state.unReadCount, this.state.page, this.state.page === StatusTab.FAVOURITE)
            if (this.state.unReadCount !== unReadCount) {
              this.updateUnreadCount(unReadCount);
            }
          }
        })
        .catch((err) => {
          // showToast('网络异常，请稍后再试');
        })
        .finally(() => {
          Portal.remove(this.updateFavLoadingKey);
        });
    } else if ('n' === fav) {
      APIs.updateFavourite(obj)
        .then((res) => {
          // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
          if ('000' === res.statusCode) {
            pfav = 'y';
            // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
            let unReadCount = this.state.unReadCount;
            let statusTabs;
            let found = -1;
            ++unReadCount;
            if (unReadCount < 0) unReadCount = 0;
            // 关注TAB页，取消则删除
            if (this.state.page === StatusTab.FAVOURITE) {
              unReadCount = 0;
              statusTabs = this.state.statusTabs.map((item) => {
                if (StatusTab.FAVOURITE === item.index) {
                  found = item.data.findIndex((d) => d.id === id);
                  if (found > -1) item.data.splice(found, 1);
                  if (item.data.length < 1) {
                    item.noData = true;
                    item.loading = false;
                  }
                }
                return item;
              });
              this.setState({ statusTabs });
            } else {
              this.updateMatchItemFavouriteStatus(id, pfav);
            }
            // console.log('updateFavourite res', res, pfav, fav, unReadCount, this.state.unReadCount, this.state.page, this.state.page === StatusTab.FAVOURITE)
            if (this.state.unReadCount !== unReadCount) {
              this.updateUnreadCount(unReadCount);
            }
          }
        })
        .catch((err) => {
          // showToast('网络异常，请稍后再试');
        })
        .finally(() => {
          Portal.remove(this.updateFavLoadingKey);
        });
    }
  };

  backTop = async () => {
    await this.refContent?.scrollToIndex({ index: 0 });
    await this.setState({
      showBackTop: false
    });
  };

  parseDateStr(dstr = '') {
    let ds = dstr.split('-');
    if (ds.length === 1) return null;
    return new Date(ds[0], parseInt(ds[1]) - 1, ds[2], 0, 0, 0);
  }
  getMatchListSource = CancelToken.source();
  getMatchListTimer = null;
  /**
   * 获取比赛列表（全部、进行中、赛程、赛果、关注）
   */
  getMatchList = (isReset) => {
    if (!EventBus.has('evtNofityToMatchListPage')) {
      EventBus.addListenser('evtNofityToMatchListPage', (data) => {
        this.socketMessageHandler(data);
      });
    }
    const page = this.state.page;
    let statusTabs = this.state.statusTabs;
    let list = [];
    list = list.concat(statusTabs);
    let curTab = list[page];
    if (this.getMatchListTimer !== null) clearTimeout(this.getMatchListTimer);

    if (isReset) {
      const data = {
        ...curTab,
        loading: false,
        loadMore: true,
        page: 0,
        data: { ...curTab.data }
      };
      curTab = { ...data };
    }
    if (curTab.loadMore === false || curTab.page >= curTab.totalPage) return;
    let params = {};
    Portal.remove(this.matchListLoadingKey);
    this.getMatchListSource.cancel('canceled');
    if (!isReset && curTab.page === 0) {
      this.matchListLoadingKey = Toast.loading(
        '加载数据中...',
        0,
        enptyFn,
        false
      );
    }
    if (page === StatusTab.IN_PLAY) {
      params.from = 'foot_match_v_jinxinzhong';
    } else if (page === StatusTab.AGENDA) {
      params.from = 'foot_match_ex_saichen';
      params.dateTime = curTab.date;
    } else if (page === StatusTab.ENDS) {
      params.from = 'foot_match_ex_saiguo';
      params.dateTime = curTab.date;
    } else if (page === StatusTab.FAVOURITE) {
      params.from = 'mat_fav';
    }
    let id = store.getState().login.loginInfo.id;
    params.deviceId = devideId;
    if (undefined !== id) {
      params.memberId = id;
    }
    if (this.state.matchFilterParams.length > 0) {
      params.matchEventId = this.state.matchFilterParams + '';
    }
    params.page = curTab.page;
    if (!isReset) {
      curTab.page++;
    } else {
      params.page = curTab.page = 0;
    }
    this.getMatchListSource = CancelToken.source();
    params.cancelToken = this.getMatchListSource.token;
    this.setState({ ...this.state, statusTab: {} });
    APIs.getMatchList(params).then(
      (res) => {
        this.setState({ isRefreshing: false });
        // console.log(`数据是res ===`, res);
        Portal.remove(this.matchListLoadingKey);
        clearTimeout(this.getMatchListTimer);
        if (res?.content?.length > 0) {
          if (curTab.page === 1) {
            curTab.data = [];
          }
          curTab.data.push(...res.content);
          curTab.totalPage = res.totalPages;
          if (curTab.page >= res.totalPages) {
            curTab.loadMore = false;
          }
        } else if (curTab.page === 1 && res?.content?.length === 0) {
          curTab.data = [];
        }
        curTab.loading = false;
        curTab.noData = curTab.data.length < 1;
        list[this.state.page] = curTab;
        this.setState({ ...this.state, statusTab: list });
      },
      (err) => {
        this.setState({ isRefreshing: false });
        curTab.loading = false;
        curTab.timeout = true;
        curTab.page--;
        statusTabs[this.state.page] = curTab;
        this.setState({ statusTabs });
        Portal.remove(this.matchListLoadingKey);
        if (statusTabs[this.state.page].data.length === 0) {
          const { updataDataError } = this.props;
          updataDataError(true);
        } else {
          showToast('网络异常，请稍后再试');
        }
      }
    );
    this.getMatchListTimer = setTimeout(() => {
      this.getMatchListSource.cancel('TIMEOUT');
    }, axios.defaults.timeout);
  };

  getAllInPlayMatchList() {
    let params = { from: 'foot_match_v_jinxinzhong' };
    return APIs.getMatchList(params, {});
  }

  resetLoadMoreStatus(curTab) {
    if (curTab.loadMore === false) {
      curTab.loadMore = true;
      if (curTab?.data?.length > 0) {
        let loadMoreItem = curTab.data[curTab.data.length - 1];
        if (loadMoreItem.loadMore === false) {
          curTab.data.splice(curTab.data.length - 1, 1);
        }
      }
    }
    return curTab;
  }

  /**
   * 刷新当前列表
   */
  refreshMatchList = () => {
    let statusTabs = this.state.statusTabs;
    let curTab = statusTabs[this.state.page];
    curTab.page = 0;
    curTab.data = [];
    curTab.loading = true;
    curTab.timeout = false;
    curTab = this.resetLoadMoreStatus(curTab);
    this.getTabsOfMatchFilter();
    this.setState({ statusTabs }, this.getMatchList(false));
  };

  refreshList = () => {
    this.setState({ isRefreshing: true });
    this.getMatchList(true);
    this.getTabsOfMatchFilter();
  };

  /**
   * 更新赛事收藏状态
   */
  updateMatchItemFavouriteStatus = (id, fav) => {
    let statusTabs = this.state.statusTabs.map((item) => {
      if (this.state.page === item.index) {
        let found = item.data.findIndex((d) => d.id === id);
        if (found > -1) {
          let matchItem = Object.assign({}, item.data[found]);
          matchItem.fav = fav;
          matchItem.updateFlag = Date.now();
          item.data[found] = matchItem;
        }
      }
      return item;
    });
    this.setState({ statusTabs });
  };

  endReachedHandler = () => {
    this.getMatchList(false);
  };

  weekHeaderOnLoad = (today, type) => {
    let statusTabs = this.state.statusTabs;
    statusTabs[type].date = today.date;
    this.setState({ statusTabs });
  };

  socketMessageHandler(data) {
    let st = Date.now();
    let msg = JSON.parse(data.msg);
    let type = data.msgType;
    // console.log('info type =', type, msg);
    switch (type) {
    case SocketDataMsgType.EVENTDATA:
      // this.eventDataUpdate(msg);
      break;
    case SocketDataMsgType.SHORT_EVENTDATA: {
      this.eventDataUpdate(socketDataArrayToObject(msg, SocketDataMsgType.SHORT_EVENTDATA));
      break;
    }
    case SocketDataMsgType.REALTIMEDATA:
      // this.realtimedataUpdate(msg);
      break;
    case SocketDataMsgType.SHORT_REALTIMEDATA: {
      this.realtimedataUpdate(socketDataArrayToObject(msg, SocketDataMsgType.SHORT_REALTIMEDATA));
      break;
    }
    case SocketDataMsgType.ALLMATCHSTATE:
      this.realmatchstateOrAllMatchstateUpdate(msg);
      break;
    case SocketDataMsgType.REALTIMEEVENT: // 增加赛事
      this.addMatch(msg);
      break;
    }
    // console.log(`info 赛事首页 socketMessageHandler ${type} time: `, Date.now() - st);
  }

  addMatch(data) {
    // let msgObj = JSON.parse(data.msg);
    let mlen = data.length;
    // console.log('服务端发过来的增加赛事的数据：', msgObj);
    for (let i = 0; i < mlen; i++) {
      let item = data[i];
      let status = getMatchStatus(item.matchStatus);
      let tabIndex = this.state.statusTabs.findIndex((item) => item.index === this.state.page);
      if (this.state.page === StatusTab.IN_PLAY && status === MatchStaus.IN_PLAY) {
        let found = this.isExistMatch(item.id, tabIndex);
        if (!found && item.id) {
          this.addMatchToList(item, tabIndex, StatusTab.IN_PLAY);
        }
      } else if (this.state.page === StatusTab.ENDS && status === MatchStaus.ENDS) {
        let found = this.isExistMatch(item.id, tabIndex);
        if (!found && item.id) {
          this.addMatchToList(item, tabIndex, StatusTab.ENDS);
        }
      }
    }
  }

  getGoalInfo(item) {
    let obj = this.state.statusTabs[this.state.page].data;
    let len = obj.length;
    let newItem = { ...item };
    for (let i = 0; i < len; i++) {
      let mObj = obj[i];
      if (mObj.id === item.matchId) {
        newItem.saishi = mObj.matchEventNameZh;
        newItem.time_api = item.time;
        newItem.zhudui = mObj.homeNameZh;
        newItem.kedui = mObj.awayNameZh;
        newItem.zhudiu_bifen = item.homeScore;
        newItem.kedui_bifen = item.awayScore;
        newItem.id = item.matchId;
        newItem.type = parseInt(item.type);
        newItem.redHomeCount = mObj.redHomeCount;
        newItem.redAwayCount = mObj.redAwayCount;
        newItem.position = item.position;
        return newItem;
      }
    }
    return null;
  }

  getRedInfo(item) {
    let obj = this.state.statusTabs[this.state.page].data;
    let len = obj.length;
    let newItem = { ...item };
    for (let i = 0; i < len; i++) {
      let mObj = obj[i];
      if (mObj.id === item.matchId) {
        newItem.saishi = mObj.matchEventNameZh;
        newItem.time_api = item.time;
        newItem.zhudui = mObj.homeNameZh;
        newItem.kedui = mObj.awayNameZh;
        newItem.zhudiu_bifen = mObj.homeScore;
        newItem.kedui_bifen = mObj.awayScore;
        newItem.redHomeCount = item.homeRedCount;
        newItem.redAwayCount = item.awayRedCount;
        newItem.id = item.matchId;
        newItem.type = parseInt(item.type);
        newItem.position = item.position;
        return newItem;
      }
    }
    return null;
  }

  /**
   * 更新红牌，黄牌，进球，角球等信息
   * @param {*} data 
   */
  eventDataUpdate(data) {
    // console.log('info eventDataUpdate=', data);
    let st2 = Date.now();
    let page = this.state.page;
    let tabs = this.state.statusTabs;
    let curTabData = [...tabs[page].data];
    let redCards = objectsOfPropToObjectsOfArray(data.red);
    let yellowCards = data.yellow;
    let goalsIn = objectsOfPropToObjectsOfArray(data.goal);
    let cornersKick = data.corner;
    let halfScores = data.halfScore;
    let score = data.score;
    let dataItem;
    let len, i, j, k, m, n, o;
    for (i = 0, len = curTabData.length; i < len; i++) {
      dataItem = curTabData[i];
      // 红牌
      for (j = 0; j < redCards.length; j++) {
        if (dataItem.id === redCards[j].matchId) {
          switch (redCards[j].position) {
          case 1:
            dataItem.redHomeCount = redCards[j].homeRedCount;
            break;
          case 2:
            dataItem.redAwayCount = redCards[j].awayRedCount;
            break;
          }
        }
      }
      // 黄牌
      for (k = 0; k < yellowCards.length; k++) {
        if (dataItem.id === yellowCards[k].matchId) {
          dataItem.yellowHomeCount = yellowCards[k].home;
          dataItem.yellowAwayCount = yellowCards[k].away;
        }
      }
      // 进球
      for (m = 0; m < goalsIn.length; m++) {
        if (dataItem.id === goalsIn[m].matchId) {
          dataItem.homeScore = goalsIn[m].homeScore;
          dataItem.awayScore = goalsIn[m].awayScore;
          dataItem.position = goalsIn[m].position;
        }
      }
      // 角球
      for (n = 0; n < cornersKick.length; n++) {
        if (dataItem.id === cornersKick[n].matchId) {
          dataItem.cornerHomeCount = cornersKick[n].home;
          dataItem.cornerAwayCount = cornersKick[n].away;
        }
      }
      // 半场比分
      for (o = 0; o < halfScores.length; o++) {
        if (dataItem.id === halfScores[o].matchId) {
          dataItem.halfHomeSoce = halfScores[o].halfHomeSoce;
          dataItem.halfAwaySoce = halfScores[o].halfAwaySoce;
        }
      }
      // 比分
      for (let i = 0, len = score.length; i < len; i++) {
        if (dataItem.id === score[i].matchId) {
          dataItem.homeScore = score[i].homeScore;
          dataItem.awayScore = score[i].awayScore;
        }
      }
    }
    if (dataItem) {
      dataItem.updateFlag = Date.now();
    }
    let reminders = this.state.reminders.slice();
    if (page === StatusTab.IN_PLAY) {
      let item, type, newItem;
      for (let i = 0, len = goalsIn.length; i < len; i++) {
        item = goalsIn[i];
        type = parseInt(item.type);
        // 进球提醒
        if (type === CompetitionFootballEventTypes.GOAL_IN) {
          newItem = this.getGoalInfo(item);
          if (null == newItem || this.isInReminders(newItem)) {
            continue;
          }
          reminders.unshift(newItem);
          if (reminders.length > 3) {
            let item = reminders.pop();
            this.updateHighLightById(item.matchId);
          }
          // console.log('进球', JSON.stringify(reminders), JSON.stringify(newItem));
          this.updateHighLightById(item.matchId, this.who(item.position));
          // console.log('进球');
        }
      }

      // 红牌提醒
      for (let i = 0, mlen = redCards.length; i < mlen; i++) {
        item = redCards[i];
        type = parseInt(item.type);
        if (type === CompetitionFootballEventTypes.RED_CARD) {
          newItem = this.getRedInfo(item);
          if (null == newItem || this.isInReminders(newItem)) {
            continue;
          }
          reminders.unshift(newItem);
          if (reminders.length > 3) {
            let item = reminders.pop();
            this.updateHighLightById(item.matchId);
          }
          this.updateHighLightById(item.matchId, this.who(item.position));
          // console.log('红牌');
        }
      }
    }
    tabs[page].data = curTabData;
    // console.log('eventDataUpdate end tiem=', Date.now() - st2);
    this.setState({ statusTabs: tabs, reminders });
  }

  realtimedataUpdate(data) {
    let list = [...this.state.statusTabs];
    let statusTab = list[this.state.page].data;
    let len = statusTab.length;
    let mlen = data.length;
    for (let i = 0; i < len; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = data[j];
        // console.log(`第${i}条总的数据id=${tabsItem.id}   第${j}条更新的数据的id='      ${updataItem.matchId}     updataItem.oddType=${updataItem.oddType}`)
        if (updateItem.matchId === tabsItem.id) {
          // console.log('更新前的=', tabsItem);
          // console.log('更新的数据=', updateItem);
          if ('asia' === updateItem.oddType) {
            // console.log(
            //   `更新了左边i=${i}id=${updateItem.matchId}homeodd=${updateItem.homeOdd},tieOdd${updateItem.tieOdd},awayOdd${updateItem.awayOdd},状态${updateItem.oddState}`
            // );
            tabsItem.asiaHomeEndOdds = updateItem.homeOdd;
            tabsItem.asiaTieEndOdds = updateItem.tieOdd;
            tabsItem.asiaAwayEndOdds = updateItem.awayOdd;
            // tabsItem.teeTime = updateItem.sendDate;
            tabsItem.matchStatus = updateItem.oddState;
            tabsItem.yapan_home_odds_up_down_flag = updateItem.homeChange;
            tabsItem.yapan_away_odds_updown_flag = updateItem.awayChange;
            // if (i === 0) {
            //    console.log(`第${i}个左边边边主队应该是${updateItem.homeChange}   客队应该是${updateItem.awayChange}   homeOdd${updateItem.homeOdd}  tieOdd${updateItem.tieOdd}    awayOdd${updateItem.awayOdd}`);
            // };

            // console.log('更新后的=', tabsItem);
            // console.log('刷新的数据=', list);
            setTimeout(() => {
              this.setState({ ...this.state, statusTab: list });
            }, 0);
          } else if ('bs' === updateItem.oddType) {
            // console.log('更新前的=', tabsItem);
            // console.log('更新的数据=', updateItem);
            // console.log(`更新了右边i=${i}id=${updateItem.matchId}homeodd=${updateItem.homeOdd},tieOdd${updateItem.tieOdd},awayOdd${updateItem.awayOdd},状态${updateItem.oddState}`);
            tabsItem.bsHomeEndOdds = updateItem.homeOdd;
            tabsItem.bsTieEndOdds = updateItem.tieOdd;
            tabsItem.bsAwayEndOdds = updateItem.awayOdd;
            // tabsItem.teeTime = updateItem.sendDate;
            tabsItem.matchStatus = updateItem.oddState;
            tabsItem.daxiaoqiu_home_odds_up_down_flag = updateItem.homeChange;
            tabsItem.daxiaoqiu_away_odds_updown_flag = updateItem.awayChange;
            // if (i === 0) {
            //   console.log(`第${i}个右边边主队应该是${updateItem.homeChange}   客队应该是${updateItem.awayChange}   homeOdd${updateItem.homeOdd}  tieOdd${updateItem.tieOdd}    awayOdd${updateItem.awayOdd}`);
            // };
            // console.log('更新后的=', tabsItem);
            // console.log('刷新的数据=', list);
            setTimeout(() => {
              this.setState({ ...this.state, statusTab: list });
            }, 0);
          }
        }
      }
      tabsItem.updateFlag = Date.now();
    }
  }

  realmatchstateOrAllMatchstateUpdate(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let arr = data; // JSON.parse(data.msg);
    if (undefined !== arr && null !== arr) {
      // 改变状态
      for (let i = 0, len = statusTab.length; i < len; i++) {
        let tabsItem = statusTab[i];
        for (let j = 0, mlen = arr.length; j < mlen; j++) {
          let updateItem = arr[j];
          // console.log(`发来更新的 第${i}个的状态由${tabsItem.matchStatus}改成${updateItem.matchStatus}`);
          if (updateItem.matchId === tabsItem.id) {
            // console.log(`实际更新的                id是${tabsItem.id}第${i}个的状态由${tabsItem.matchStatus}改成${updateItem.matchStatus}`);
            tabsItem.matchStatus = updateItem.matchStatus;
            tabsItem.teeTime = updateItem.teeTime;
            tabsItem.updateFlag = Date.now();
            this.setState({ ...this.state, statusTabs: list });
          }
        }
      }
      // 删除比赛
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let status = getMatchStatus(item.matchStatus);
        // console.log('删除id=', item.matchId, '状态码是=', item.matchStatus, '状态是=', status);
        if (this.state.page === StatusTab.IN_PLAY && status !== MatchStaus.IN_PLAY) {
          let tabIndex = this.state.statusTabs.findIndex((item) => item.index === StatusTab.IN_PLAY);
          this.deleteMatchItemById(item.matchId, tabIndex, StatusTab.IN_PLAY);
        } else if (this.state.page === StatusTab.AGENDA && (status === MatchStaus.IN_PLAY || status === MatchStaus.ENDS)) {
          let tabIndex = this.state.statusTabs.findIndex((item) => item.index === StatusTab.AGENDA);
          this.deleteMatchItemById(item.matchId, tabIndex, StatusTab.AGENDA);
        }
      }
    }
  }

  isInReminders(data) {
    return this.state.reminders.find((item) => {
      return JSON.stringify(item) == JSON.stringify(data);
    });
  }

  batchUpdateList(datas, tabIndex) {
    if (datas.length <= 0) return;
    let tab = this.state.statusTabs[tabIndex];
    if (tab) {
      let found;
      let c = 0;
      for (let i = 0; i < tab.data.length; i++) {
        found = datas.find((item) => item.id === tab.data[i].id);
        if (found) {
          tab.data[i] = Object.assign({}, tab.data[i], found);
          c++;
        }
      }
      // console.log('batchUpdateList 更新了 ', c)
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(tabIndex, 1, tab);
      this.setState({ statusTabs });
    }
  }

  isExistMatch(id, tabIndex) {
    let tab = this.state.statusTabs[tabIndex];
    if (tab) {
      return tab.data.findIndex((item) => item.id === id) >= 0;
    }
    return false;
  }

  /**
   * 更新z的升降状态（上升，下降）
   * @param {*} match
   */
  updateMatch(match = {}) {
    let index = this.state.statusTabs.findIndex(
      (item) => item.index === StatusTab.IN_PLAY
    );
    if (index >= 0) {
      let tab = this.state.statusTabs[index];
      let matches = tab.data;
      for (let i = 0, len = matches.length; i < len; i++) {
        if (matches[i].id === match.id) {
          matches[i] = Object.assign({}, matches[i], match);
          break;
        }
      }
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }
  /**
   * 增加一个赛事
   * @param {*} data
   * @param {*} tabIndex
   */
  addMatchToList(data, tabIndex, type = StatusTab.IN_PLAY) {
    let index = this.state.statusTabs.findIndex((item) => item.index === type);
    let list = [...this.state.statusTabs];
    let tab = list[tabIndex];
    // console.log(`添加前数组长度===${list[tabIndex].data.length}`);
    if (tab && index >= 0) {
      tab.data.push(data);
      // console.log('增加一场比赛id', data?.id);
      // console.log('比赛名字',data?.matchEventNameZh);
      // console.log('主队名字',data?.homeNameZh);
      // console.log('客队名字', data?.awayNameZh);
      // console.log('比赛状态', data?.matchStatus);
      if (tab.data.length) {
        tab.noData = false;
        tab.loading = false;
        tab.timeout = false;
      }
      list.splice(index, 1, tab);
      // console.log(`添加后数组长度===${list[tabIndex].data.length}`);
      setTimeout(() => {
        this.setState({ ...this.state, statusTabs: list });
      }, 0);
    }
  }
  /**
   * 删除一个赛事
   * @param {*} id
   * @param {*} tabIndex
   */
  deleteMatchItemById(id, tabIndex, type = StatusTab.IN_PLAY) {
    let index = this.state.statusTabs.findIndex((item) => item.index === type);
    let list = [...this.state.statusTabs];
    let tab = list[tabIndex];
    if (tab && index >= 0) {
      for (let i = 0, len = tab.data.length; i < len; i++) {
        if (tab.data[i].id === id) {
          // console.log(`进行中删除一场比赛id${tab.data[i]?.id}比赛名字 ${tab.data[i]?.matchEventNameZh} 比赛主队名字  ${tab.data[i]?.homeNameZh} 客队名字 ${tab.data[i]?.awayNameZh}比赛状态${tab.data[i]?.matchStatus}`);
          tab.data.splice(i, 1);
          break;
        }
      }
      if (0 === tab.data.length) {
        tab.noData = true;
        tab.loading = false;
      }
      list.splice(index, 1, tab);
      this.setState({ ...this.state, statusTabs: list });
    }
  }

  judgeChange(d1, d2) {
    return d1 > d2 ? 'up' : d1 < d2 ? 'down' : 'equal';
  }

  /**
   * 根据赛事列表ID更新赛事队名高亮标识(增加或取消队名高亮)
   * @param {*} id 赛事列表ID
   * @param {*} teamType 队类型（主队:home | 客队:away）， 为空则取消高亮
   */
  updateHighLightById(id, teamType = '') {
    let index = this.state.statusTabs.findIndex(
      (item) => item.index === StatusTab.IN_PLAY
    );
    // let index = this.state.statusTabs.findIndex((item) => item.index === StatusTab.ALL);//?tom test
    if (index >= 0) {
      let tab = this.state.statusTabs[index];
      let matches = tab.data;
      for (let i = 0, len = matches.length; i < len; i++) {
        if (matches[i].id === id) {
          matches[i].homeHasActiveEvent = teamType === 'home';
          matches[i].awayHasActiveEvent = teamType === 'away';
          matches[i].updateFlag = Date.now();
          matches[i] = Object.assign({}, matches[i]);
          break;
        }
      }
      tab.data = matches.slice(0);
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }

  /**
   * 提示结束
   */
  reminderShowEnd = (id) => {
    let reminders = this.state.reminders.slice();
    let found = reminders.findIndex((item) => item.id === id);
    if (found >= 0) reminders.splice(found, 1);
    this.updateHighLightById(id);
    // this.setState({ reminders });
    this.setState({ ...this.state, reminders: reminders });
  };

  who(type) {
    // 事件发生方,0-中立 1,主队 2,客队
    return type === 1 ? 'home' : type === 2 ? 'away' : '';
  }

  componentWillUnmount() {
    EventBus.removeListenser('evtNofityToMatchListPage');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  renderlistItem = (itemData) => {
    // console.log(`渲染数组长度===${len}`);
    // item, index, curTab?.data?.length
    // item, index, len, needFav = true, curTabData = false
    const {
      item,
      index,
      needFav,
      curTabData
    } = itemData;
    const {
      state:{
        statusTabs,
        page,
      },
    } = this;
    const curTab = statusTabs[page];
    const len = curTab?.data?.length;
    const date = curTabData ? curTabData.date : false;
    return (
      <ListItem
        key={item.id}
        data={item}
        date={date}
        listType={this.state.gameType}
        itemType={this.footballTabTypeMapping[this.state.page]}
        isFirstItem={index === 0}
        isLastItem={index === (len - 1)}
        len={len}
        index={index}
        updateFavourite={this.updateFavourite}
        showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
        needFav={needFav || true}
        updateFlag={item.updateFlag}
        component={this}
      />
    );
  };
  renderListFooter = (noData = false) => {
    let curTab = this.state.statusTabs[this.state.page];
    const len = curTab?.data?.length;
    const loadMore = curTab.loadMore;
    let listViewHeight = this.getListViewHeight();
    let itemCount = Math.floor(listViewHeight / px(142));
    // console.log('renderfooterlist --------', len, loadMore, noData);
    // console.log('info renderListFooter', len, loadMore, noData, ' listViewHeight=', listViewHeight, itemCount)
    // console.log('saldjfsdfjsld----', loadMore === false , noData === false , itemCount);
    return (
      <>
        {len > 0 &&
          <ShadowBox
            // inner // <- enable inner shadow
            useSvg // <- set this prop to use svg on ios
            style={styles.shadowBoxStyle}
          >
          </ShadowBox>}
        {loadMore === false && noData === false && len >= (itemCount - 1) && <NoMoreData style={{ marginBottom: px(40) }} />}
        <View style={{ height: px(100) }}></View>
      </>
    );
  };

  getListViewHeight() {
    return this.state.containerHeight - px(74);
  }

  layoutHandler = (event) => {
    this.setState({
      containerHeight: event?.nativeEvent?.layout?.height || winHeight,
    });
  };

  scrollStart = (e) => {
    if (e?.nativeEvent) {
      if (e.nativeEvent?.velocity?.y >= 3 || e.nativeEvent?.velocity?.y <= -3) {
        this.setState({ showBackTop: false });
      }
    }
  };

  scrollEnd = (e) => {
    if (e?.nativeEvent) {
      let canShowBackTop =
        e.nativeEvent.contentOffset?.y +
        e.nativeEvent.layoutMeasurement?.height >=
        e.nativeEvent.layoutMeasurement?.height * 3;
      if (this.state.showBackTop && !canShowBackTop) {
        this.setState({ showBackTop: false });
      } else if (!this.state.showBackTop && canShowBackTop) {
        this.setState({ showBackTop: true });
      }
    }
  };

  handleForceUpdate = () => {
    const { updataDataError } = this.props;
    updataDataError(false);
    this.getTabsOfMatchFilter();
    this.init();

  };
  renderFlatList=(propsData)=>{
    const{
      curTab,
      refreshing,
      noData,
      itemData
    } = propsData;
    const footer = ()=>{
      this.renderListFooter(noData);
    };
    return (
      <FlatList
        ref={(ref) => (this.refContent = ref)}
        data={curTab?.data}
        keyExtractor={(item, index) => index + ''}
        onEndReached={this.endReachedHandler}
        onEndReachedThreshold={this.END_REACHED_THRESHOLD}
        renderItem={({ item, index }) =>
          this.renderlistItem({
            item,
            index,
            ...itemData
          })
        }
        ListFooterComponent={noData ? footer : this.renderListFooter}
        showsVerticalScrollIndicator={
          this.showsVerticalScrollIndicator
        }
        initialNumToRender={this.INITIAL_NUM_TO_RENDER}
        removeClippedSubviews={this.removeClippedSubviews}
        windowSize={this.LIST_WINDOW_SIZE}
        onMomentumScrollBegin={this.scrollStart}
        // onScroll={onScroll ? onScroll : ()=>null}
        onMomentumScrollEnd={this.scrollEnd}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.refreshList}
          />
        }
        getItemLayout={(data, index) => (
          {length: px(142), offset: px(142) * index, index}
        )}
      />
    );
  }
  render() {
    const {
      state:{
        statusTabs,
        page,
        refreshing
      },
      props:{
        dataError,
        netStatus,
      },
      renderFlatList
    } = this;
    const curTab = statusTabs[page];
    const listData = {
      curTab,
      refreshing
    };
    return (
      <View style={styles.container} onLayout={this.layoutHandler}>
        {this.state.showTabs && (
          <Tabs
            tabs={this.state.tabs}
            tabBarBackgroundColor={theme.header.backgroundColor}
            tabBarInactiveTextColor={theme.text.color9}
            tabBarActiveTextColor={theme.background.color12}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            swipeable={this.state.tabsConfig.swipeable}
            useOnPan={this.state.tabsConfig.useOnPan}
            usePaged={this.state.tabsConfig.usePaged}
            onChange={this.tabHandler}
            initialPage={this.state.page}
            // animated={Platform.OS === 'android' ? false : true}
            ref={(ref) => (this.tabRef = ref)}
          >
            <View style={[styles.tabContent, cstyle.pdL20, cstyle.pdR20]}>
              {dataError ? netStatus ? <NetWorkError onPress={this.handleForceUpdate} /> : <NoInternet /> : <>
                {this.state.page === StatusTab.ALL && !curTab.loading && (
                  renderFlatList({
                    ...listData,
                  })
                )}
                {this.state.page === StatusTab.ALL && (
                  <CommonResult
                    loading={curTab.loading}
                    noData={curTab?.noData}
                    timeout={curTab?.timeout}
                    onPress={this.refreshMatchList}
                  />
                )}
              </>}
            </View>
            <View style={[styles.tabContent, cstyle.flex1]}>
              {dataError ? netStatus ? <NetWorkError onPress={this.handleForceUpdate} /> : <NoInternet /> : <>
                {this.state.page === StatusTab.IN_PLAY && (
                  <View style={[cstyle.pdL20, cstyle.pdR20]}>
                    {!curTab.loading && (
                      renderFlatList({
                        ...listData,
                      })
                    )}
                  </View>
                )}
                {this.state.page === StatusTab.IN_PLAY &&
                  this.state.reminders &&
                  this.state.reminders.length > 0 && (
                  <View style={styles.reminderWp}>
                    {this.state.reminders.map((info, i) => (
                      <Reminder
                        type={this.state.gameType}
                        id={info.id}
                        matchName={info.saishi}
                        matchTime={info.time_api}
                        teamHomeName={info.zhudui}
                        teamAwayName={info.kedui}
                        homeScore={info.zhudiu_bifen}
                        awayScore={info.kedui_bifen}
                        remiderType={info.type}
                        homeRedCard={info.redHomeCount}
                        awayRedCard={info.redAwayCount}
                        eventTeamType={this.who(parseInt(info.position))}
                        key={i}
                        showEnd={this.reminderShowEnd}
                      />
                    ))}
                  </View>
                )}
                {this.state.page === StatusTab.IN_PLAY && (
                  <CommonResult
                    loading={curTab.loading}
                    noData={curTab?.noData}
                    timeout={curTab?.timeout}
                    onPress={this.refreshMatchList}
                  />
                )}
              </>}
            </View>
            <View style={styles.tabContent}>
              {dataError ? netStatus ? <NetWorkError onPress={this.handleForceUpdate} /> : <NoInternet /> : <>
                {this.state.page === StatusTab.AGENDA && (
                  <>
                    <WeekHeader
                      click={this.weekHeaderHandler}
                      onLoad={(d) => this.weekHeaderOnLoad(d, StatusTab.AGENDA)}
                      updateFlag={curTab.updateFlag}
                    />
                    <View style={[cstyle.pdL20, cstyle.pdR20]}>
                      {!curTab.loading && (
                        renderFlatList({
                          ...listData,
                        })
                      )}
                    </View>
                  </>
                )}
                {this.state.page === StatusTab.AGENDA && (
                  <CommonResult
                    loading={curTab.loading}
                    noData={curTab?.noData}
                    timeout={curTab?.timeout}
                    onPress={this.refreshMatchList}
                    noDataMsg="暂无相关赛程"
                  />
                )}
              </>}
            </View>
            <View style={styles.tabContent}>
              {dataError ? netStatus ? <NetWorkError onPress={this.handleForceUpdate} /> : <NoInternet /> : <>
                {this.state.page === StatusTab.ENDS && (
                  <>
                    <WeekHeader
                      click={this.weekHeaderHandler}
                      onLoad={(d) => this.weekHeaderOnLoad(d, StatusTab.ENDS)}
                      beforeWeek={true}
                      page={this.state.page}
                      updateFlag={curTab.updateFlag}
                    />
                    <View style={[cstyle.pdL20, cstyle.pdR20]}>
                      {!curTab.loading && (
                        renderFlatList({
                          ...listData,
                          itemData:{
                            needFav:false,
                            curTabData:curTab
                          },
                        })
                      )}
                    </View>
                  </>
                )}
                {this.state.page === StatusTab.ENDS && (
                  <CommonResult
                    loading={curTab.loading}
                    noData={curTab?.noData}
                    timeout={curTab?.timeout}
                    onPress={this.refreshMatchList}
                    noDataMsg="暂无相关赛果"
                  />
                )}
              </>}
            </View>
            <View style={styles.tabContent}>
              {dataError ? netStatus ? <NetWorkError onPress={this.handleForceUpdate} /> : <NoInternet /> : <>
                <View style={[cstyle.pdL20, cstyle.pdR20]}>
                  {this.state.page === StatusTab.FAVOURITE && !curTab.loading && (
                    renderFlatList({
                      ...listData,
                    })
                  )}
                </View>
                {this.state.page === StatusTab.FAVOURITE && (
                  <CommonResult
                    loading={curTab.loading}
                    noData={curTab?.noData}
                    timeout={curTab?.timeout}
                    onPress={this.refreshMatchList}
                    noDataType={StatusTab.FAVOURITE}
                    noDataOnPress={this.gotoAllCompetition}
                  />
                )}
              </>}
            </View>
          </Tabs>
        )}
        <BackTop
          show={this.state.showBackTop}
          onPress={this.backTop}
          style={styles.backTop}
        />
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(withWrapTeleport(Competition));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
    paddingBottom: theme.screenPaddingBottom,
  },
  headerLeftImage: {
    width: px(36),
    height: px(36),
  },
  headerRightImage: {
    width: px(36),
    height: px(32),
  },
  tabBarTextStyle: {
    fontSize: px(26),
  },
  tabBarBackgroundColor: {
    backgroundColor: theme.header.backgroundColor,
  },
  tabBarUnderlineStyle: {
    borderColor: theme.background.color12,
    backgroundColor: theme.background.color12,
  },
  tabContent: {
    // padding: px(20)
  },
  badgeTabTxt: {
    backgroundColor: theme.header.backgroundColor,
    color: theme.text.color9,
    fontSize: px(26),
  },
  noDataBtn: {
    width: px(170),
    height: px(60),
    marginTop: px(30),
    backgroundColor: theme.button.color,
  },
  noDataBtnTxt: {
    fontSize: px(24),
  },
  networkErr: {
    marginTop: px(140),
  },
  listTip: {
    height: px(80),
    paddingTop: px(20),
    alignItems: 'center',
  },
  listTipTxt: {
    color: theme.text.color7,
  },
  reminderWp: {
    width: '100%',
    position: 'absolute',
    top: px(0),
    zIndex: 101,
  },
  backTop: {
    bottom: px(140),
  },
  shadowBoxStyle: {
    shadowOffset: { width: px(6), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(10),
    borderBottomLeftRadius: px(20),
    borderBottomRightRadius: px(20),
    backgroundColor: theme.background.colorWhite,
    width: px(710),
    height: px(10),
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.border.color16,
  },
});
