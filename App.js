/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  BackHandler,
  AppState,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
// import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation';
import useLinking from './src/navigation/useLinking';
import store from './src/store';
import AppActions from './src/store/actions';
import { Provider as AntProvider, Toast } from '@ant-design/react-native';
import theme from './src/styles/theme';
// import storage from './src/utils/token'
const Stack = createStackNavigator();
import PortalProvider, { PortalGate } from './src/components/portal';
import Orientation from 'react-native-orientation';
import MyWebSocket from './src/socket';
import EventBus from './src/utils/eventBus';
// const Stack = createStackNavigator();
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';

let socket = null;

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  // const { getInitialState } = useLinking(containerRef);

  function initSocket() {
    // console.log('info app initSocket socket=', socket, socket?.socket.readyState)
    if (socket?.socket && [0, 1].includes(socket?.socket?.readyState)) {
      // console.log('info app initSocket socket 1=', socket?.socket?.readyState)
      return;
    }
    socket = new MyWebSocket({
      name: 'index',
      url: 'webSocket/sendMsgCenter',
      onmessage: (data) => {
        // console.log('info onmesson =', data);
        EventBus.emit('evtNofityToMatchListPage', data);
        EventBus.emit('evtNofityToMatchDetailPage', data);
      },
      onclose: () => {
        // console.log('info app websocket closed', socket?.socket?.readyState);
      },
    });
    if (!EventBus.has('evtNofityToMatchDetailPageSend')) {
      EventBus.addListenser('evtNofityToMatchDetailPageSend', (data) => {
        socket.send(data);
      });
    }
  }

  function handleAppStateChange(state) {
    if (state === 'active') {
      initSocket();
    }
  }

  React.useEffect(() => {
    Orientation.lockToPortrait();
    initSocket();
    AppState.addEventListener('change', handleAppStateChange);
    NetInfo.addEventListener(state => {
      store.dispatch(AppActions.setStateNetInfoModel({
        netStatus: state.isConnected
      }));
    });
  }, []);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHide();

        // Load our initial navigation state
        // setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
          'digital-7': require('./src/assets/fonts/digital-7.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        // console.warn(e);
      } finally {
        setLoadingComplete(true);
        setTimeout(() => {
          SplashScreen.hide();
        }, 100);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  const _onStateChange = React.useCallback(() => {
    let stateData = store.getState();
    if (stateData.netInfoModel.dataError) {
      store.dispatch(AppActions.setStateNetInfoModel({
        dataError: false
      }));
    }
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <AntProvider>
            <PortalProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                  {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                  <NavigationContainer 
                    onStateChange={_onStateChange}
                  >
                    <BottomTabNavigator />
                  </NavigationContainer>
                  <PortalGate gateName={'home'} />
                </View>
              </SafeAreaView>
            </PortalProvider>
          </AntProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
});
