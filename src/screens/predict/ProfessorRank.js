import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Picker } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import { getinit, apprecord, appstraightwins } from '../../http/APIs';
import { Tabs, Toast, Portal } from '@ant-design/react-native';
import Header from './professorHeader';
function showToast(text) {
  Toast.info(text, 1, false);
}
const mapState = (state) => ({
});

const mapDispatch = {
};

/**
 * 专家排名（足球、篮球）
 */
class ProfessorRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTabs: [
        { title: '推荐', index: 0 },
        { title: '红单榜', index: 1 }
      ],
      isRecommend: true,
      data: [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'First Item',
          expertName: 'aaa',
          record: '近7中10',
          straightWins: '连红3',
          picUrl: 'http://imgcps.jd.com/ling/100011852116/546755KD5p2v6LSo6YeP5LyY/562J5L2g5YWl5omL/p-5bd8253082acdd181d02fa37/e9e6c5f6/590x470.jpg',
          newsSize: 2,
          winSize: 2,
          walkSize: 2,
          loseSize: 2,
          hitRate: 0.77,
          order: 0,
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Second Item',
          expertName: 'aaa',
          record: '近7中10',
          straightWins: '连红3',
          picUrl: 'http://imgcps.jd.com/ling/100011852116/546755KD5p2v6LSo6YeP5LyY/562J5L2g5YWl5omL/p-5bd8253082acdd181d02fa37/e9e6c5f6/590x470.jpg',
          newsSize: 2,
          winSize: 2,
          walkSize: 2,
          loseSize: 2,
          hitRate: 0.77,
          order: 1,
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Third Item',
          expertName: 'aaa',
          record: '近7中10',
          straightWins: '连红3',
          picUrl: 'http://imgcps.jd.com/ling/100011852116/546755KD5p2v6LSo6YeP5LyY/562J5L2g5YWl5omL/p-5bd8253082acdd181d02fa37/e9e6c5f6/590x470.jpg',
          newsSize: 2,
          winSize: 2,
          walkSize: 2,
          loseSize: 2,
          hitRate: 0.77,
          order: 0,
        },
      ],
      selectedTab: 'redTab',
      type: 'java',
      tableHead: ['专家', '总', '胜', '走', '负', '命中率'],
      tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
      tableData: [
        ['1', '2', '3', '5', '9', '9'],
        ['1', '2', '3', '5', '9', '9'],
        ['1', '2', '3', '5', '9', '9'],
        ['1', '2', '3', '5', '9', '9'],
      ]
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: (props) => (
        <Header onPress={this.navBarTabsHandler.bind(this)} {...props} />
      ),
    });
    this.navBarTabsHandler({ name: 'football' });
  }
  // 足球 篮球切换
  navBarTabsHandler(props) {
    this.handleNav(apprecord, {sportType: props.name == 'football' ? 1 : 2});
  }
  // 推荐 红单榜切换
  tabHandler() {
    this.handleNav(appstraightwins, {});
  }
  // 请求数据
  /**
   @param {string} portInfo 接口地址
   @param {object}  query   参数     
   **/
  handleNav(portInfo, query) {
    console.log('query',query);
    getinit([portInfo, query]).then(res => {
      console.log('猛料推荐', res);
    },
    err => {
      console.log('猛料推荐err', err);
      showToast('网络异常，请稍后再试');
    }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs
          tabs={this.state.statusTabs}
          tabBarBackgroundColor={theme.header.backgroundColor}
          tabBarInactiveTextColor={theme.text.color9}
          tabBarActiveTextColor={theme.text.color36}
          tabBarUnderlineStyle={theme.text.color36}
          onChange={() => { this.tabHandler; }}
          page={this.state.page}
        >
          {/* 推荐 */}
          <ScrollView>
            <View style={styles.pepLayout}>
              <Text style={styles.expertW}>专家</Text>
              <Text style={styles.border}>总</Text>
              <Text style={styles.border}>胜</Text>
              <Text style={styles.border}>走</Text>
              <Text style={styles.border}>负</Text>
              <Text style={styles.border}>命中率</Text>
            </View>
            {this.state.data && this.state.data.map((item, index) => {
              return (
                <View style={styles.pepLayout} key={index}>
                  <View style={styles.expert}>
                    <Image
                      style={styles.timg}
                      source={item.picUrl}
                    />
                    <View style={styles.peoInfo}>
                      <Text>{item.expertName}</Text>
                      <View>
                        <Text>{item.record}</Text>
                        <Text>{item.straightWins}</Text>
                      </View>

                    </View>

                  </View>
                  <Text >{item.newsSize}</Text>
                  <Text>{item.winSize}</Text>
                  <Text>{item.walkSize}</Text>
                  <Text>{item.loseSize}</Text>
                  <Text>{item.hitRate}</Text>
                </View>
              );

            })}
          </ScrollView>
          {/* 红单 */}
          <ScrollView>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={this.state.typeTime}
                mode='dropdown'
                prompt='Picker'
                style={styles.picker}
                onValueChange={(lang) => this.setState({ type: lang })}>
                <Picker.Item label='周榜' value='1' style={styles.pickerItem} />
                <Picker.Item label='月榜' value='2' />
                <Picker.Item label='季榜' value='3' />
              </Picker>
            </View>
            <View style={styles.pepLayout}>
              <Text>排名</Text>
              <Text style={styles.expertW}>专家</Text>
              <Text style={styles.border}>总</Text>
              <Text style={styles.border}>胜</Text>
              <Text style={styles.border}>走</Text>
              <Text style={styles.border}>负</Text>
              <Text style={styles.border}>命中率</Text>
            </View>
            {this.state.data && this.state.data.map((item, index) => {
              return (
                <View style={styles.pepLayout} key={index}>
                  {item.order == 0 ? <Text>0</Text> : <Text>1</Text>}
                  <View style={styles.expert}>
                    <Image
                      style={styles.timg}
                      source={item.picUrl}
                    />
                    <View style={styles.peoInfo}>
                      <Text>{item.expertName}</Text>
                      <View>
                        <Text>{item.record}</Text>
                        <Text>{item.straightWins}</Text>
                      </View>

                    </View>

                  </View>
                  <Text >{item.newsSize}</Text>
                  <Text>{item.winSize}</Text>
                  <Text>{item.walkSize}</Text>
                  <Text>{item.loseSize}</Text>
                  <Text>{item.hitRate}</Text>
                </View>
              );

            })}
          </ScrollView>
        </Tabs>

      </View>);
  }
}

export default connect(mapState, mapDispatch)(ProfessorRank);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  pepLayout: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  expertW: {
    width: px(300),
  },
  expert: {
    width: px(300),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  timg: {
    width: px(100),
    height: px(100),
    borderRadius: px(50),
    borderColor: 'red',
    borderWidth: px(1),
    borderStyle: 'solid',
  },
  peoInfo: {
    // display: 'flex',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row'
  },
  border: {
    borderColor: theme.border.colorGray,
    borderStyle: 'solid',
    borderWidth: px(2),
  },
  pickerWrap: {
    width: '100%',
    height: 50,
    position: 'relative',
  },
  picker: {
    color: theme.text.colorGray,
    width: 100,
    height: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: px(100)
  },
  pickerItem: {
    marginTop: px(1000)
  },
  wrapper: { flexDirection: 'row' },
  title: { width: px(500), flex: 1, backgroundColor: theme.backgroundColor.sky },
  row: { height: 28 },
  text: { textAlign: 'center' }

});
