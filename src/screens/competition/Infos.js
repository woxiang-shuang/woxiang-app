import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { Toast, Portal } from '@ant-design/react-native';
import { connect } from 'react-redux';

import { enptyFn } from '../../utils/common';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import CardView from 'react-native-cardview';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络

const mapState = (state) => {
  return {
    netStatus: state.netInfoModel.netStatus
  };
};

function Infos(props) {
  let [infos, setInfos] = React.useState([]);
  let [detailTabsError, setDetailTabsError] = React.useState(false);
  const {netStatus} = props;

  React.useEffect(() => {
    getInfosData();
  }, []);
  // {match_id: props.matchId}
  function getInfosData() {
    // let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    // APIs.getInfosDataOfDetail().then((res) => {
    //   if (res?.data) {
    //     console.log('情报', res);
    //     setInfos(res.data);
    //   }
    // })
    // .catch((err) => {
    //   // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
    //   console.log('错误', err);
    //   setDetailTabsError(true);
    // })
    // .finally((data) => {  
    //   Portal.remove(key);
    // });
  }

  function render(type) {
    if (infos.length === 0) {
      return <Text style={styles.infoTitleTxt}>暂无数据</Text>;
    } else {
      return infos && infos.map((item, i) => {
        if (item.type === type) {
          return (
            <View key={item.type + i}>
              <View><Text style={styles.infoTitleTxt}>{item.title}</Text></View>
              <View><Text style={styles.infoContentTxt}>{item.context}</Text></View>
            </View>
          );
        } else {
          return <React.Fragment key={item.type + i}></React.Fragment>;
        }
      });
    }
  }

  const netWorkOnPress = React.useCallback(() => {
    setDetailTabsError(false);
    getInfosData();
  }, [setDetailTabsError, getInfosData]);

  return (
    <View style={styles.container}>
      {detailTabsError ? netStatus ? <NetWorkError onPress={netWorkOnPress} /> : <NoInternet /> : <ScrollView style={cstyle.pd20} showsVerticalScrollIndicator={false}>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View style={styles.titleBox}>
              <View style={styles.leftLine}></View>
              <Text style={styles.txtRed}>有利情报</Text>
            </View>
            <View style={styles.typeSecContent}>
              {render('有利情报')}
            </View>
          </View>
        </CardView>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View style={styles.titleBox}>
              <View style={styles.leftLine2}></View>
              <Text style={styles.txtGreen}>不利情报</Text>
            </View>
            <View style={styles.typeSecContent}>
              {render('不利情报')}
            </View>
          </View>
        </CardView>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View style={styles.titleBox}>
              <View style={styles.leftLine3}></View>
              <Text style={styles.txtLeafGreen}>中立情报</Text>
            </View>
            <View style={styles.typeSecContent}>
              {render('中立情报')}
            </View>
          </View>
        </CardView>
      </ScrollView>}
    </View>
  );
}

export default connect(mapState)(Infos);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  txtRed: {
    color: theme.text.color22,
    fontSize: px(26)
  },
  txtGreen: {
    color: theme.text.color24,
    fontSize: px(26)
  },
  txtLeafGreen: {
    color: theme.text.color23,
    fontSize: px(26)
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftLine: {
    width: px(6),
    height: px(34),
    backgroundColor: theme.border.color10,
    marginRight: px(14)
  },
  leftLine2: {
    width: px(6),
    height: px(34),
    backgroundColor: theme.border.color11,
    marginRight: px(14)
  },
  leftLine3: {
    width: px(6),
    height: px(34),
    backgroundColor: theme.border.color12,
    marginRight: px(14)
  },
  typeTitle: {
    borderLeftWidth: px(6),
    paddingLeft: px(20)
  },
  infoTitleTxt: {
    color: theme.text.color18,
    fontSize: px(24),
    marginTop: px(20),
  },
  infoContentTxt: {
    color: theme.text.color21,
    fontSize: px(24),
    marginTop: px(10)
  },
  typeSec: {
    borderWidth: px(2),
    borderColor: theme.border.color8,
    // marginBottom: px(20),
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(10),
    // paddingRight: px(10),
    borderRadius: px(8),
    paddingTop: px(20),
    paddingBottom: px(20),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  typeSecContent: {
    minHeight: px(100)
  },
  shadowBox: {
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(20),
    // paddingRight: px(20),

    borderRadius: px(8),
    marginBottom: px(30),
  }
});
