
import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { px } from '../../utils/adapter';
import theme from '../../styles/theme';
import cstyle from '../../styles/common';

import TabBarIcon from '../../components/tab-bar-icon';

const tabBarFooterBackgroundImage = require('../../assets/images/tab-bar-footer-bg.png');

export default function TabBarFooter({ state, descriptors, navigation, style, tabBarOptions }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  
  return (
    <View style={[cstyle.flexDirecR, styles.tabBarFooter,  style || {}]}>
      <ImageBackground source={tabBarFooterBackgroundImage} style={[cstyle.flexDirecR, styles.footerBgImage]}>
        <View style={[cstyle.flexDirecR, styles.innerWp]}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              if (route.name === 'Koksport') {
                return;
              }
              if (route.name === 'My') {
                navigation.navigate('My');
              }
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[cstyle.flex1, styles.tabItem]}
                key={index}
              >
                <View style={[]}>
                  <View style={[cstyle.flexDirecR, cstyle.flexJcC, styles.tabItemIcon]}>
                    <TabBarIcon focused={isFocused} name={route.name.toLowerCase()} />
                  </View>
                  <Text style={[{ color: isFocused ? theme.tabBarOptions.activeTintColor : theme.tabBarOptions.inactiveTintColor }, styles.tabItemLebel, cstyle.flexDirecR, cstyle.txtC]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarFooter: {
    width: '100%',
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    bottom: 0,
  },
  tabItem: {
  },
  tabItemIcon: {
    height: px(38)
  },
  tabItemLebel: {
    height: px(27),
    fontSize: px(18),
    marginTop: px(10)
  },
  footerBgImage: {
    width: '100%',
    height: px(119),
    paddingTop: px(14),
  },
  innerWp: {
    width: '100%',
    height: px(96),
    marginTop: px(24),
  }
});
