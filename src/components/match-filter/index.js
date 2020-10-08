import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { cstyle, theme, px, txtEllipsis } from '../../styles';
import CheckBox from '../checkbox';
import { Tabs } from '@ant-design/react-native';
import NoDataPlaceHolder from '../no-data-placeholder';

export default function MatchFilter(props) {
  let { typesData = [], tabsData = [] } = props;
  let [checked, setChecked] = React.useState(true);
  let [checkedCount, setCheckedCount] = React.useState(0);
  let [page, setPage] = React.useState(0);
  let [datas, setDatas] = React.useState([]);
  let [tabs, setTabs] = React.useState([]);
  let [noData, setNoData] = React.useState(false);
  let [quickLetters, setQuickLetters] = React.useState([]); // "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  let elRef = {};
  let tabScrollview = {};
  let el = {};
  React.useEffect(() => {
    // setDatas(tabsData);
    if (tabsData) {
      setTabs(tabsData);
      setNoData(typesData.length <= 0);
      setQuickLetters(getLetters(tabsData[0].datas));
      updateCheckedCount(tabsData);
    }
  }, [tabsData]);
  function getLetters(datas = []) {
    return datas.map(item => {
      return item.title;
    });
  }
  function close() {
    props.close && props.close();
  }
  function sure() {
    if(checkedCount === 0) {
      return;
    }
    props.updateTypesData && props.updateTypesData(getCurTabCheckedTypeIds());
    close();
  }
  function getCurTabCheckedTypeIds() {
    let ids = [];
    for (let i = 0; i < tabs.length; i++) {
      if (page === i) {
        tabs[i].datas.forEach(data => {
          data.items.forEach(item => {
            if (item.checked) ids.push(item.id);
          });
        });
        break;
      }
    }
    return ids;
  }
  function checkBoxChanged(state) {
    setChecked(state);
    updateAllTypeItems(state);
  }
  // tabs列表切换
  function tabHandler(tab, index) {
    setPage(index);
    setQuickLetters(getLetters(tabsData[index].datas));
    updateCheckedCount(undefined, index);
  }
  function itemCheckedHandler(tabIndex, i, j) {
    if (tabs && tabs[tabIndex].datas && tabs[tabIndex].datas.length > 0) {
      tabs[tabIndex].datas[i].items[j].checked = !tabs[tabIndex].datas[i].items[j].checked;
      setTabs(tabs.slice());
      updateCheckedCount(tabs);
    }
  }
  // 更新已选择的数量
  function updateCheckedCount(tabData, tabIndex) {
    tabData = tabData || tabs;
    tabIndex = tabIndex !== undefined ? tabIndex : page;
    let count = 0;
    let curTabTotalItem = 0;
    for (let i = 0; i < tabData.length; i++) {
      if (tabIndex === i && tabData[i].datas) {
        tabData[i].datas.forEach(data => {
          curTabTotalItem += data.items.length;
          data.items.forEach(item => {
            if (item.checked) count++;
          });
        });
        break;
      }
    }
    setCheckedCount(count);
    setChecked(count === curTabTotalItem);
  }
  // 更新全选或取消全选数据
  function updateAllTypeItems(checked) {
    let count = 0;
    tabs.forEach((tab, i) => {
      if (page === i) {
        tab.datas.forEach(data => {
          data.items.forEach(item => {
            item.checked = checked;
            if (item.checked) count++;
          });
        });
      }
    });
    setTabs(tabs.slice());
    setCheckedCount(count);
  }
  function quickScrollTo(letter, index) {
    // console.log('info quickScrollTo =', letter, page, index, tabScrollview[page].scrollToIndex);
    tabScrollview[page].scrollToIndex({ index: index });
  }
  let MatchFilterelements = (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bgMask} onPress={close} activeOpacity={1}></TouchableOpacity>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTitle}><Text>赛事筛选</Text></View>
          <TouchableOpacity style={styles.btnClose} onPress={close} activeOpacity={theme.clickOpacity}>
            <Image source={require('../../assets/images/cancel.png')} style={styles.btnCloseImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.tabWp}>
          {tabs && tabs.length > 0 &&
            <Tabs tabs={tabs}
              tabBarBackgroundColor={theme.header.backgroundColor}
              tabBarInactiveTextColor={theme.text.color9}
              tabBarActiveTextColor={theme.background.color12}
              tabBarTextStyle={styles.tabBarTextStyle}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
              // page={page} 
              onChange={tabHandler}
            >
              {tabs && tabs.map((tab, tabIndex) => (
                <View style={cstyle.flex1} key={tabIndex}>
                  {tab.datas && tab.datas.length > 0 && <FlatList
                    data={tab.datas}
                    style={[cstyle.flex1, styles.innerContent]}
                    ref={ref => tabScrollview[tabIndex] = ref}
                    keyExtractor={(item, index) => (index + '')}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.typeCategory} key={index} ref={(ref) => elRef[item.title + page] = ref}>
                          <View><Text style={styles.typeTitle}>{item.title}</Text></View>
                          <View style={[cstyle.flexDirecR, cstyle.flexWpWp, styles.typeCategoryItems]}>
                            {item.items && item.items.map((item, j) => (
                              <View style={styles.typeItemWp} key={j}>
                                <TouchableOpacity style={[cstyle.flex1, styles.typeItem, item.checked ? styles.typeItemSelected : {}]} onPress={() => itemCheckedHandler(tabIndex, index, j)} activeOpacity={theme.clickOpacity}>
                                  <Text style={[styles.typeItemTxt, item.checked ? styles.typeItemTxtSelected : {}]}>{txtEllipsis(item.shortNameZh, 5)}</Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    }}
                  />}
                  {tab.datas && tab.datas.length <= 0 && <View style={cstyle.flex1}>
                    <NoDataPlaceHolder msg="暂无相关赛事类型" />
                  </View>}
                </View>
              ))}
            </Tabs>
          }
        </View>
        <View style={styles.footerBarWp}>
          <View style={[cstyle.flexDirecR, styles.footerBar]}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1, styles.rowL]}>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <CheckBox checked={checked} change={checkBoxChanged} />
              </View>
              <Text style={cstyle.pdLR10}>|</Text>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Text style={styles.txtGray}>已选择</Text>
                <Text style={checkedCount > 0 ? styles.txtBlue : styles.txtGray}>{checkedCount}</Text>
                <Text style={styles.txtGray}>场次</Text>
              </View>
            </View>
            <TouchableOpacity style={checkedCount > 0 ? styles.btnSure : styles.btnSureTxtNoChose} onPress={() => sure()} activeOpacity={theme.clickOpacity}><Text style={ styles.btnSureTxt}>确定</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.quickPos}>
          {quickLetters && quickLetters.map((item, i) => (
            <TouchableOpacity key={i} style={styles.btnQuickPos} onPress={() => quickScrollTo(item, i)} activeOpacity={theme.clickOpacity}>
              <Text style={styles.btnQuickPosTxt}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
  return MatchFilterelements;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: theme.matchFilter.bgColor
  },
  bgMask: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  innerContainer: {
    width: '100%',
    height: px(1150),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background.colorWhite,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 2
  },
  header: {
    width: '100%',
    height: px(72),
    backgroundColor: theme.header.backgroundColor, // theme.background.colorWhite,
    position: 'relative',
  },
  headerTitle: {
    height: px(72),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWp: {
    flex: 1,
  },
  tabBarBackgroundColor: {
    backgroundColor: theme.header.backgroundColor
  },
  tabBarUnderlineStyle: {
    borderColor: theme.background.color12,
    backgroundColor: theme.background.color12,
  },
  innerContent: {
    paddingTop: px(15),
    paddingBottom: px(80),
    paddingRight: px(50),
    paddingLeft: px(50),
  },
  typeCategory: {
    borderWidth: 1,
    borderColor: theme.border.colorWhite
  },
  typeCategoryItems: {

  },
  typeTitle: {
    paddingTop: px(10),
    paddingBottom: px(10),
    paddingRight: px(10)
  },
  typeItemWp: {
    width: '33.33%',
    paddingLeft: px(10),
    paddingRight: px(10)
  },
  typeItem: {
    borderWidth: px(2),
    borderColor: theme.border.color4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: px(8),
    paddingBottom: px(8),
    marginBottom: px(20),
    borderRadius: px(10),
    overflow: 'hidden'
  },
  typeItemTxt: {
    fontSize: px(24),
    color: theme.text.color14
  },
  typeItemSelected: {
    backgroundColor: theme.background.color14,
    borderColor: theme.border.color5,
  },
  typeItemTxtSelected: {
    color: theme.text.color10
  },
  btnClose: {
    width: px(72),
    height: px(72),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  btnCloseImg: {
    width: px(30),
    height: px(30)
  },
  footerBarWp: {

  },
  footerBar: {
    width: '100%',
    height: px(80),
    backgroundColor: theme.background.colorWhite
  },
  rowL: {
    paddingLeft: px(54)
  },
  txtBlue: {
    color: theme.text.color6
  },
  txtGray: {
    color: theme.text.color16
  },
  btnSure: {
    width: px(280),
    backgroundColor: theme.background.color12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSureTxt: {
    color: theme.text.colorWhite,
    fontSize: px(26),
  },
  btnSureTxtNoChose: {
    width: px(280),
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disable: {
    backgroundColor: theme.background.color10
  },
  quickPos: {
    width: px(54),
    height: px(600),
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnQuickPos: {
    width: px(30),
    height: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnQuickPosTxt: {
    fontSize: px(16),
    color: theme.text.color15
  }
});
