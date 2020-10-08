import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
  Slider,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import { px } from '../../utils/adapter';
import theme from '../../styles/theme';
import { connect } from 'react-redux';
import AppActions from '../../store/actions';

const screenWidth = Dimensions.get('window').width;
const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
};

function formatTime(second) {
  let h = 0,
    i = 0,
    s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return v >> 0 < 10 ? '0' + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(':');
}

class VideoPlayer extends React.PureComponent {
  imageVolumeUp = require('../../assets/images/ic_volume_up.png');
  imageVolumeOff = require('../../assets/images/ic_volume_off.png');
  imageArticle = require('../../assets/images/article.png');
  iconControlPause = require('../../assets/images/icon_control_pause.png');
  iconControlPlay = require('../../assets/images/icon_control_play.png');
  iconControlShrinkScreen = require('../../assets/images/icon_control_shrink_screen.png');
  iconControlFullScreen = require('../../assets/images/icon_control_full_screen.png');

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const URLS = props.route.params.urls;
    this.state = {
      videoUrl: URLS.mp4url,
      videoCover: URLS.coverimg,
      videoWidth: screenWidth,
      videoHeight: (screenWidth * 9) / 16, // 默认16：9的宽高比
      showVideoCover: true, // 是否显示视频封面
      showVideoControl: true, // 是否显示视频控制组件
      isPlaying: false, // 视频是否正在播放
      currentTime: 0, // 视频当前播放的时间
      duration: 0, // 视频的总时长
      isFullScreen: false, // 当前是否全屏显示
      playFromBeginning: false, // 是否从头开始播放
      isDetail: false,
      timer: null,
      isMuted: false, // 声音
      isFail: false,
      loadingText: '视频加载中...',
      startVideo: false,
    };
  }

  componentDidMount() {
    this.props.updateFooterTabBar({ show: false });
    this.onPressPlayButton();
  }

  componentWillUnmount() {
    this.props.updateFooterTabBar({ show: true });
    Orientation.lockToPortrait();
  }

  render() {
    let imageVolume = !this.state.isMuted
      ? this.imageVolumeUp
      : this.imageVolumeOff;
    return (
      <View style={styles.content} onLayout={this._onLayout}>
        <View
          style={{
            width: this.state.videoWidth,
            height: this.state.videoHeight,
            backgroundColor: theme.background.colorBlack,
          }}
        >
          {
            this.state.startVideo && (
              <Video
                ref={(ref) => (this.videoPlayer = ref)}
                source={{ uri: this.state.videoUrl }}
                rate={1.0}
                volume={1.0}
                muted={this.state.isMuted}
                paused={!this.state.isPlaying}
                resizeMode={'contain'}
                playWhenInactive={false}
                playInBackground={false}
                ignoreSilentSwitch={'ignore'}
                progressUpdateInterval={250.0}
                onLoadStart={this._onLoadStart}
                onProgress={this._onProgressChanged}
                onLoad={this._onLoaded} // 加载媒体并准备播放时调用的回调函数。
                onPress={this.togglePlay} // 视频播放过程中每个间隔进度单位调用的回调函数
                onEnd={this._onPlayEnd} // 视频播放结束时的回调函数
                onError={this._onPlayError}
                onBuffer={this._onBuffering}
                onReadyForDisplay={() => this.setState({ isFail: false })}
                style={styles.videoScreen}
              />
            )
            // {width: this.state.videoWidth, height: this.state.videoHeight},
          }
          {/* 关闭视屏 */}
          <TouchableOpacity
            style={styles.closeVideo}
            onPress={() => this.props.navigation.goBack()}
          >
            <View>
              {/* <Image
                source={imageVolume}
              /> */}
              <Image 
                source={require('../../assets/images/left-arrow.png')} 
                style={styles.closeVideoHeader}
              ></Image>
            </View>
          </TouchableOpacity>
          {/* 视频静音按钮 */}
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ isMuted: !this.state.isMuted });
            }}
          >
            <View style={styles.view1}>
              <Image
                style={{ width: px(20), height: px(20) }}
                source={imageVolume}
              />
            </View>
          </TouchableWithoutFeedback>
          {/* 视频加载提示文字 */}
          {this.state.isFail ? (
            <View style={styles.view2}>
              <Text style={styles.textV}>{this.state.loadingText}</Text>
            </View>
          ) : null}
          {/* 视频加载之前的封面图片 */}
          {this.state.showVideoCover && (
            <Image
              style={[
                styles.view3,
                {
                  width: this.state.videoWidth,
                  height: this.state.videoHeight,
                },
              ]}
              resizeMode={'cover'}
              source={
                this.state.videoCover === ''
                  ? this.imageArticle
                  : { uri: this.state.videoCover }
              }
            />
          )}
          {/* 资讯列表播放按钮 */}
          <TouchableWithoutFeedback
            onPress={() => {
              this.hideControl();
            }}
            onStartShouldSetResponderCapture={() => {
              return true;
            }}
          >
            <View
              style={[
                styles.view4,
                {
                  width: this.state.videoWidth,
                  height: this.state.videoHeight,
                },
                {
                  backgroundColor: this.state.isPlaying
                    ? theme.backgroundColor.transparent
                    : theme.backgroundColor.videobg,
                },
              ]}
            >
              {this.state.isPlaying ? null : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.onPressPlayButton();
                  }}
                >
                  <Image
                    style={styles.playButton}
                    source={require('../../assets/images/icon-play.png')}
                  />
                </TouchableWithoutFeedback>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/* 视频及进度条显示 */}
        {this.state.showVideoControl || this.state.isDetail ? (
          <View style={[styles.control, { width: this.state.videoWidth }]}>
            <TouchableWithoutFeedback
              activeOpacity={0.3}
              onPress={() => {
                this.onControlPlayPress();
              }}
            >
              <Image
                style={styles.playControl}
                source={
                  this.state.isPlaying
                    ? this.iconControlPause
                    : this.iconControlPlay
                }
              />
            </TouchableWithoutFeedback>
            <Text style={styles.time}>
              {formatTime(this.state.currentTime)}
            </Text>
            <Slider
              style={styles.flex1}
              maximumTrackTintColor={'#999999'}
              minimumTrackTintColor={'#00c06d'}
              thumbImage={require('../../assets/images/icon_control_slider.png')}
              value={this.state.currentTime}
              minimumValue={0}
              maximumValue={this.state.duration}
              onValueChange={(currentTime) => {
                this.onSliderValueChanged(currentTime);
              }}
            />
            <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
            <TouchableWithoutFeedback
              activeOpacity={0.3}
              onPress={() => {
                this.onControlShrinkPress();
              }}
            >
              <View style={styles.viewImg}>
                <Image
                  style={styles.shrinkControl}
                  source={
                    !this.state.isFullScreen
                      ? this.iconControlShrinkScreen
                      : this.iconControlFullScreen
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    );
  }

  // -------Video组件回调事件-------

  _onLoadStart = () => {
    console.log('视频开始加载');
    this.setState({ isFail: true });
  };

  _onBuffering = () => {
    console.log('视频缓冲中...');
    this.setState({
      isFail: true,
      loadingText: '视频缓冲中...',
      isPlaying: false,
    });
  };

  _onLoaded = (data) => {
    this.setState({
      duration: data.duration,
    });
  };
  // 视频进度更新
  _onProgressChanged = (data) => {
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
      });
    }
  };
  _onPlayEnd = () => {
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true,
      showVideoCover: true,
    });
  };

  _onPlayError = () => {
    this.setState({
      isFail: true,
      loadingText: '视频加载失败...',
      isPlaying: false,
    });
  };

  // -------控件点击事件-------

  // 控制播放器工具栏的显示和隐藏
  hideControl() {
    if (!this.state.isDetail) {
      this.setState(
        {
          isPlaying: !this.state.isPlaying,
          showVideoCover: !this.state.showVideoCover,
          startVideo: true,
        },
        () => {
          if (this.state.isPlaying) {
            const URLS = this.props.route.params.urls;
            DeviceEventEmitter.emit('thisIdStopPlaying', URLS.id);
          }
        }
      );
    } else {
      // debounce(()=>{
      //   this.setState({showVideoControl:!this.state.showVideoControl})
      // },5000)
    }
  }

  // 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
  _onLayout = (event) => {
    // 获取根View的宽高
    let { width, height } = event.nativeEvent.layout;
    let Awidth = event.nativeEvent.layout.width;
    let Aheight = event.nativeEvent.layout.height;
    // let { width, height } = Dimensions.get('window');
    // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
    let isLandscape = width > height;
    console.log(width, Awidth, height, Aheight, isLandscape);

    if (isLandscape) {
      this.setState({
        videoWidth: width,
        videoHeight: height,
        isFullScreen: true,
      });
    } else {
      this.setState({
        videoWidth: width,
        videoHeight: (height * 9) / 16,
        isFullScreen: false,
      });
    }
  };

  // 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    this.setState({
      isPlaying: !this.state.isPlaying,
      showVideoCover: false,
      startVideo: true,
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      });
    }
    const URLS = this.props.route.params.urls;
    DeviceEventEmitter.emit('thisIdStopPlaying', URLS.id);
  }

  // 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }

  // 点击了工具栏上的全屏按钮
  onControlShrinkPress() {
    if (this.state.isFullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
  }

  // 进度条值改变
  onSliderValueChanged(currentTime) {
    this.videoPlayer.seek(currentTime);
    if (this.state.isPlaying) {
      this.setState({
        currentTime: currentTime,
      });
    } else {
      this.setState({
        currentTime: currentTime,
        isPlaying: true,
        showVideoCover: false,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: theme.background.colorBlack,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flex1: {
    flex: 1,
  },
  videoScreen: {
    width: '100%',
    height: '100%',
    //  borderColor:'green',
    //  borderStyle:'solid',
    //  borderWidth:px(3),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeVideo: {
    position: 'absolute',
    top: 0,
    left: px(10),
    padding: px(10),
    zIndex: 9
  },
  closeVideoHeader: {
    width: px(24),
    height: px(35)
  },
  closeText: {
    color: theme.text.colorWhite
  },
  view1: {
    position: 'absolute',
    top: px(10),
    right: 0,
    width: px(50),
    height: px(50),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  view2: {
    position: 'absolute',
    top: '25%',
    left: '45%',
    marginLeft: px(-75),
    width: px(150),
    height: px(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  view3: {
    position: 'absolute',
    top: 0,
    left: 0,
    // width: screenWidth,
    // height: screenHeight
    // width: this.state.videoWidth,
    // height: this.state.videoHeight
  },
  view4: {
    position: 'absolute',
    top: 0,
    left: 0,
    // width: screenWidth,
    // height: screenHeight,
    // width: this.state.videoWidth,
    // height: this.state.videoHeight,
    // backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // view4bg1:{
  //   backgroundColor:theme.backgroundColor.transparent
  // },
  // view4bg2:{
  //   backgroundColor:theme.backgroundColor.videobg,
  // },
  viewImg: {
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  textV: {
    fontSize: px(16),
    color: theme.text.colorWhite,
  },
  playButton: {
    width: px(50),
    height: px(50),
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: px(30),
    height: px(30),
    marginRight: px(30),
    alignSelf: 'center',
  },
  time: {
    fontSize: 12,
    color: theme.text.colorWhite,
    marginLeft: 10,
    marginRight: 10,
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    backgroundColor: theme.backgroundColor.detailInfo,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default connect(null, mapDispatch)(VideoPlayer);
