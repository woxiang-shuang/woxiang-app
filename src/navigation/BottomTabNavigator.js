import * as React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import theme from '../styles/theme';

import Header from '../components/header';
import TabBarFooter from '../components/tab-bar-footer';
import TabBarIcon from '../components/tab-bar-icon';
import CompetitionScreen from '../screens/competition';
import CompetitionDetailScreen from '../screens/competition/Detail';

/* 猛料 */
import PredictScreen from '../screens/predict';
import PredictMatchListScreen from '../screens/predict/MatchList';
import PredictMatchRecommendScreen from '../screens/predict/MatchRecommend';
import PredictDetailScreen from '../screens/predict/PredictDetail';
import PredictProfessorRankScreen from '../screens/predict/ProfessorRank';
import PredictProfessorRecommendScreen from '../screens/predict/ProfessorRecommend';
import PredictPublishScreen from '../screens/predict/Publish';
import PredictRelativePredictScreen from '../screens/predict/RelativePredict';

/* 资讯 */
import NewsScreen from '../screens/news';
import NewsDetailsScreen from '../screens/news/detail';
import NewsVideoPlayerScreen from '../screens/news/VideoPlayer';
/* 我的 */
import MyScreen from '../screens/my';
import History from '../screens/my/history';
import Advice from '../screens/my/advice';
import Setting from '../screens/my/setting';
import Space from '../screens/my/space';
import About from '../screens/my/about';

/* 修改信息 */
import Edit from '../screens/my/edit';
import Modify from '../screens/my/modify';

// 登录、注册、找加密码
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register/index';
import FindPassPhoneNumberScreen from '../screens/find-password/findPass';
import FindPassScreen from '../screens/find-password/index';
import { px } from '../utils/adapter';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Competition';
// const INITIAL_ROUTE_NAME = 'News';

let globalScreenOptions = {
  headerTitleAlign: 'center',
  headerTitleStyle: {
    color: theme.text.colorWhite,
  },
};
function screenHeaderOptions(options = {}) {
  let defaultOptions = {
    header: (props) => <Header {...props} />,
  };
  return Object.assign(defaultOptions, options);
}
let tabBarConfig = {
  tabBarOptions: {
    inactiveTintColor: theme.tabBarOptions.inactiveTintColor,
    inactiveBackgroundColor: theme.tabBarOptions.inactiveBackgroundColor,
    activeBackgroundColor: theme.tabBarOptions.activeBackgroundColor,
    activeTintColor: theme.tabBarOptions.activeTintColor,
  },
};

const CompetionStack = createStackNavigator();
const PredictStack = createStackNavigator();
const NewsStack = createStackNavigator();
const MyStack = createStackNavigator();
const LoginStack = createStackNavigator();

let routes = [
  {
    name: 'Login',
    component: LoginScreen,
    navigationOptions: screenHeaderOptions({
      title: '',
      headerShown: false,
      animationEnabled: false,
    }),
  },
  {
    name: 'Register',
    component: RegisterScreen,
    navigationOptions: screenHeaderOptions({
      title: '注册',
      headerTintColor: '#475F7B',
      headerTitleStyle: {
        fontSize: px(30),
        animationEnabled: false,
      },
      gesturesEnabled: false,
    }),
  },
  {
    name: 'FindPass',
    component: FindPassScreen,
    navigationOptions: screenHeaderOptions({
      title: '设置新密码',
      headerTintColor: '#475F7B',
      headerTitleStyle: {
        fontSize: px(30),
      },
    }),
  },
  {
    name: 'FindPassPhoneNumber',
    component: FindPassPhoneNumberScreen,
    navigationOptions: screenHeaderOptions({
      title: '找回密码',
      headerTintColor: '#475F7B',
      headerTitleStyle: {
        fontSize: px(30),
      },
    }),
  },
];
// 登录
function LoginStackScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen>
        {routes.map((route) => (
          <LoginStack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </LoginStack.Screen>
      <LoginStack.Screen
        name="Competition"
        component={CompetitionStackScreen}
      ></LoginStack.Screen>
    </LoginStack.Navigator>
  );
}
// 比分
function CompetitionStackScreen() {
  return (
    <CompetionStack.Navigator
      initialRouteName="CompetitionIndex"
      screenOptions={{ animationEnabled: false }}
    >
      <CompetionStack.Screen
        name="CompetitionIndex"
        component={CompetitionScreen}
        options={screenHeaderOptions()}
      />
      <CompetionStack.Screen
        name="CompetitionDetail"
        component={CompetitionDetailScreen}
        options={screenHeaderOptions({ title: '赛事详情' })}
      />
      {routes.map((route) => (
        <CompetionStack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.navigationOptions}
        />
      ))}
    </CompetionStack.Navigator>
  );
}

// 猛料
function PredictStackScreen() {
  return (
    <PredictStack.Navigator initialRouteName="Predict">
      <PredictStack.Screen
        name="Predict"
        component={PredictScreen}
        options={screenHeaderOptions({ title: '猛料' })}
      />
      <PredictStack.Screen
        name='MatchList'
        component={PredictMatchListScreen}
        options={screenHeaderOptions({ title: '选择赛事' })}
      />
      <PredictStack.Screen
        name='MatchRecommend'
        component={PredictMatchRecommendScreen}
      />
      <PredictStack.Screen
        name='PredictDetail'
        component={PredictDetailScreen}
        options={screenHeaderOptions({ title: '猛料详情' })}
      />
      <PredictStack.Screen
        name='ProfessorRank'
        component={PredictProfessorRankScreen}
      />
      <PredictStack.Screen
        name='ProfessorRecommend'
        component={PredictProfessorRecommendScreen}
      />
      <PredictStack.Screen
        name='Publish'
        component={PredictPublishScreen}
        options={screenHeaderOptions({ title: '发布猛料' })}
      />
      <PredictStack.Screen
        name='RelativePredict'
        component={PredictRelativePredictScreen}
        options={screenHeaderOptions({ title: '发布猛料' })}
      />
      
      {routes.map((route) => (
        <PredictStack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.navigationOptions}
        />
      ))}
    </PredictStack.Navigator>
  );
}

// 资讯
function NewsStackScreen() {
  return (
    <NewsStack.Navigator
      initialRouteName="News"
      screenOptions={{ animationEnabled: false }}
    >
      <NewsStack.Screen
        name="News"
        component={NewsScreen}
        options={screenHeaderOptions({ title: '资讯' })}
      />
      <NewsStack.Screen
        name="NewsDetails"
        component={NewsDetailsScreen}
        options={screenHeaderOptions({ title: '资讯详情' })}
      />
      <NewsStack.Screen
        name="VideoPlayer"
        component={NewsVideoPlayerScreen}
        options={screenHeaderOptions({ title: '视频播放', headerShown: false })}
      />
      {routes.map((route) => (
        <NewsStack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.navigationOptions}
        />
      ))}
    </NewsStack.Navigator>
  );
}

// 我的
function MyStackScreen() {
  return (
    <MyStack.Navigator
      initialRouteName="My"
      screenOptions={{ animationEnabled: false }}
    >
      <MyStack.Screen
        name="My"
        component={MyScreen}
        options={screenHeaderOptions({
          title: '我的',
          headerShown: false,
          animationEnabled: false,
        })}
      />
      <MyStack.Screen
        name="History"
        component={History}
        options={screenHeaderOptions({ title: '我的足迹' })}
      />
      <MyStack.Screen
        name="Space"
        component={Space}
        options={screenHeaderOptions({ title: '我的空间' })}
      />
      <MyStack.Screen
        name="Advice"
        component={Advice}
        options={screenHeaderOptions({ title: '反馈建议' })}
      />
      <MyStack.Screen
        name="Setting"
        component={Setting}
        options={screenHeaderOptions({ title: '设置' })}
      />
      <MyStack.Screen
        name="About"
        component={About}
        options={screenHeaderOptions({ title: '关于我们' })}
      />
      <MyStack.Screen
        name="Edit"
        component={Edit}
        options={screenHeaderOptions({ title: '个人资料' })}
      />
      <MyStack.Screen
        name="Modify"
        component={Modify}
        options={screenHeaderOptions({
          title: '修改信息',
          animationEnabled: false,
        })}
      />
      {routes.map((route) => (
        <MyStack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.navigationOptions}
        />
      ))}
    </MyStack.Navigator>
  );
}

let EmptyScreen = () => <></>;

const mapState = (state) => ({
  state,
});

const mapDispatch = {};

function BottomTabNavigator(props) {
  // console.log('info BottomTabNavigator=', props?.state?.footerTabBar)
  React.useEffect(() => {}, [props?.state?.footerTabBar?.show]);
  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={tabBarConfig.tabBarOptions}
      tabBarVisible={tabBarConfig.tabBarVisible}
      tabBar={(props) => (
        <TabBarFooter {...props} tabBarOptions={tabBarConfig.tabBarOptions} />
      )}
    >
      <BottomTab.Screen
        name="Competition"
        component={CompetitionStackScreen}
        options={{
          title: '比分',
          iconName: 'competition',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="competition" />
          ),
          tabBarVisible: props?.state?.footerTabBar?.show,
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            // e.preventDefault();
            console.log('tabPress = ', e);
          },
        }}
      />
      <BottomTab.Screen
        name="Predict"
        component={PredictStackScreen}
        options={{
          title: '猛料',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="predict" />
          ),
          tabBarVisible: true,
        }}
      />
      <BottomTab.Screen
        name="Koksport"
        component={EmptyScreen}
        options={{
          // title: '球圣体育',
          title: '球圣体育',
          iconName: 'koksport',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={false} name="koksport" />
          ),
        }}
      />
      <BottomTab.Screen
        name="News"
        component={NewsStackScreen}
        options={{
          title: '资讯',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="news" />
          ),
          tabBarVisible: props?.state?.footerTabBar?.show,
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('News');
          },
        })}
      />
      <BottomTab.Screen
        name="My"
        component={MyStackScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="my" />
          ),
          tabBarVisible: props?.state?.footerTabBar?.show,
        }}
      />
    </BottomTab.Navigator>
  );
}

export default connect(mapState, mapDispatch)(BottomTabNavigator);

const styles = StyleSheet.create({
  tabIcon: {
    width: '100%',
    height: '100%',
  },
});
