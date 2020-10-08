import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import theme from '../../../styles/theme';
import { px } from '../../../utils/adapter';
import Touchable from '../../../components/Touchable';

const TestImage = require('../../../assets/images/article.png');
const list = [
  { image: TestImage, star: 10, title: '亚洲盘王' },
  { image: TestImage, star: 14, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
  { image: TestImage, star: 12, title: '超人神王' },
];

class PopularPredict extends React.PureComponent {
  state;
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
  }

  handleStar = () => {
    console.log('lisne');
  };
  renderItem = ({ item, index }) => {
    if (index < 9) {
      return (
        <Touchable
          style={styles.item}
          onPress={() => {
            this.handleStar();
          }}
        >
          <Image style={styles.itemImage} source={item.image} />
          <View style={styles.itemTit}>
            <Text style={styles.itemTitText}>连红{item.star}</Text>
          </View>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </Touchable>
      );
    } else if (index === 9) {
      return (
        <Touchable
          style={styles.item}
          onPress={() => {
            this.handleStar();
          }}
        >
          <View style={styles.itemLastBox}>
            <Image
              style={styles.itemLastImage}
              source={require('../../../assets/images/icon_moer2.png')}
            />
          </View>
          <Text style={styles.itemTitleWord}>更多</Text>
        </Touchable>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.titleLeft}>
            <Image
              style={styles.leftImage}
              source={require('../../../assets/images/title-feedback.png')}
            />
            <ImageBackground
              style={styles.leftTitImage}
              source={require('../../../assets/images/title-bg1.png')}
            >
              <Text style={styles.leftTitText}>人气高手</Text>
            </ImageBackground>
          </View>
          <View style={styles.titleRight}>
            <View style={styles.Tabs}>
              <Image
                source={require('../../../assets/images/feather-thumbs-up2.png')}
                style={styles.tabFirstImage}
              />
              <Text style={styles.tabText}>高手推荐</Text>
            </View>
            <View style={styles.Tabs}>
              <Image
                source={require('../../../assets/images/feather-Cup2.png')}
                style={styles.tabLastImage}
              />
              <Text style={styles.tabText}>红单榜</Text>
            </View>
          </View>
        </View>
        <FlatList
          style={styles.list}
          data={list}
          renderItem={this.renderItem}
          numColumns={5}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.border.color3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: px(20),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(20),
    height: px(40),
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftImage: {
    width: px(40),
    height: px(40),
  },
  leftTitImage: {
    height: px(38),
    marginLeft: px(10),
  },
  leftTitText: {
    fontSize: px(26),
    lineHeight: px(38),
    color: theme.text.color37,
  },
  titleRight: {
    flexDirection: 'row',
  },
  Tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.color9,
    borderRadius: px(10),
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    height: px(36),
    marginLeft: px(10),
  },
  tabFirstImage: {
    width: px(20),
    height: px(23),
  },
  tabText: {
    fontSize: px(18),
    color: theme.text.color25,
    marginLeft: px(8),
  },
  tabLastImage: {
    width: px(20),
    height: px(21),
  },
  list: {
    marginHorizontal: px(20),
  },
  item: {
    position: 'relative',
    marginRight: px(48),
    marginBottom: px(20),
  },
  itemImage: {
    width: px(96),
    height: px(96),
    borderRadius: px(48),
  },
  itemTit: {
    position: 'absolute',
    top: px(80),
    left: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background.color22,
    width: px(80),
    height: px(30),
    zIndex: 5,
    borderRadius: px(15),
  },
  itemTitText: {
    fontSize: px(18),
    color: theme.text.colorWhite,
  },
  itemTitle: {
    height: px(33),
    fontSize: px(22),
    marginTop: px(17),
    color: theme.text.color18,
    width: '100%',
    textAlign: 'center',
  },
  itemLastBox: {
    width: px(96),
    height: px(96),
    backgroundColor: theme.background.color21,
    borderRadius: px(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleWord: {
    height: px(33),
    fontSize: px(22),
    marginTop: px(15),
    color: theme.text.color18,
    width: '100%',
    textAlign: 'center',
  },
});

export default PopularPredict;
