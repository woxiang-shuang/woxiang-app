import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { px } from '../../utils/adapter';
import theme from '../../styles/theme';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  wrapper: {
    height: px(350),
    borderRadius: px(20),
    marginTop: px(10),
  }, // 整体样式
  container: {
    padding: px(20),
  },
  image: {
    marginRight: px(20),
    marginLeft: px(20),
    height: px(330),
    borderRadius: px(20),
    // margin: px(5),
  },
  dot: {
    // 未选中的圆点样式
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: px(8),
    height: px(8),
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 9,
    marginTop: 9,
    marginBottom: 20,
  },
  activeDot: {
    // 选中的圆点样式
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: px(8),
    height: px(8),
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 9,
    marginTop: 9,
    marginBottom: 20,
  },
  title: {
    position: 'absolute',
    bottom: px(0),
    width: px(710),
    height: px(47),
    paddingLeft: px(18),
    // backgroundColor:'red'
  },
  bg: {
    position: 'absolute',
    top: px(0),
    left: px(20),
    width: px(710),
    height: px(47),
    backgroundColor: 'rgba(0,0,0,.5)',
    borderBottomRightRadius: px(20),
    borderBottomLeftRadius: px(20),
  },
  titleText: {
    lineHeight: px(47),
    textAlign: 'left',
    color: theme.text.colorWhite,
    fontSize: px(26),
    marginLeft: px(20),
  },
});

const SwiperView = ({data,gotoDetail}) => {
  const renderSwiperItem = (item) => {
    return (
      <TouchableWithoutFeedback onPress={()=>
        gotoDetail(item.articleId)
      } key={item.id}>
        <Image style={styles.image} source={{ uri: item.coverNrl }} />
        <View style={styles.title}>
          <View style={styles.bg}></View>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.articleTitle}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View>
      { data.length > 0 && <Swiper
        style={styles.wrapper}
        loop={true}
        autoplay={true}
        autoplayTimeout={3} 
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        {data.map(e => renderSwiperItem(e))}
      </Swiper>}
    </View>
  );
};
export default SwiperView;
