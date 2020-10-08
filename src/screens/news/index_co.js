import React from 'react';
import { ScrollView, Text, View, Dimensions,TouchableOpacity,StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';
import APIs from '../../http/APIs';
const screenHeight = Dimensions.get('window').height;
export default class BasicTabsExample extends React.Component {
  state;
  scrollview;
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      statusTabs: [],
      loading: false,
      datalist: [],
      paused: false,
      modalVisible: true,
      loadMore: false,
      loadText: '加载完毕',
      curPageInfo: {},
      curpage: 0,
      showBackTop: false,
      initialEmpty: false,// 初始状态发现没有数据
    };
  }
  componentDidMount() {
    this.navBarTabsHandler({ name: 'football' });
  }
  render() {
    return (
      <Tabs
        tabs={this.state.statusTabs}
        tabBarBackgroundColor={theme.header.backgroundColor}
        tabBarInactiveTextColor={theme.text.color9}
        tabBarActiveTextColor={theme.background.color12}
        tabBarTextStyle={styles.tabBarTextStyle}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
        page={this.state.page}
        onTabClick={this.tabHandler}
        activeKey={this.state.page}
      />
    );
    
  } // 根据篮球足球获取两大分类下的子分类
  navBarTabsHandler(props) {
    APIs.getTypesById(props.name == 'football' ? { type: 1 } : { type: 2 })
      .then((res) => {
        let propt = [{ title: '热门', index: 0 }];
        res.content.forEach((element, index) => {
          propt.push({ title: element.name, index: index + 1, id: element.id });
        });
        this.setState({
          statusTabs: propt,
        });
        this.tabHandler(propt[0]);
        this.setState({
          curPageInfo: Object.assign({}, this.state.curPageInfo, propt[0]),
        });
        console.log(propt);
      })
      .catch((err) => {
        this.setState({initialEmpty:true});
      });
  }
}
const styles = StyleSheet.create({
  container: {
    margin: px(20),
  },
  listitem: {
    backgroundColor: theme.backgroundColor.white,
    borderRadius: px(20),
    padding: px(20),
  },
  listtitle: {
    color: theme.text.color31,
    marginBottom: px(10),
  },
  imgbox: {
    borderRadius: px(10),
    overflow: 'hidden',
    height: px(270),
  },
  timgbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timg: {
    width: '49%',
    height: px(190),
    borderRadius: px(10),
  },
  threeimg: {
    width: '32%',
    height: px(150),
    borderRadius: px(10),
  },
  img: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listbottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: px(14),
  },
  lbcolor: {
    color: theme.text.color30,
  },
  see: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: px(20),
  },
  lrpart: {
    flexDirection: 'row',
  },
  rimg: {
    height: px(200),
  },
  left: {
    width: '49%',
  },
  ltitle: {
    height: px(152),
  },
  lbottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  right: {
    width: '49%',
    marginLeft:px(8),
    height: px(200),
    borderRadius: px(10),
    overflow: 'hidden',
  },
  lbleft: {
    fontSize: px(20),
  },
  lbright: {
    fontSize: px(20),
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playbtn: {
    width: px(50),
    height: px(50),
  },
  loadmore: {
    height: px(200),
    marginTop: px(30),
    marginBottom: px(50),
    textAlign: 'center',
  },
  goTop: {
    position: 'absolute',
    bottom: px(screenHeight),
    zIndex: 9999999999,
    right: 0,
  },
  emptyList: {
    marginTop: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const title = 'Tabs';
export const description = 'Tabs example';