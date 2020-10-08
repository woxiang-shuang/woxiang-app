/* eslint-disable no-const-assign */
import React, { Component } from 'react';
import { View, PanResponder, Platform, Dimensions } from 'react-native';
import ListItem from '../../components/competition-list-item';
import EventBus from '../../utils/eventBus';
import { useNavigation } from '@react-navigation/native';
let _previousLeft = 0;
let lastLeft = 0;
let dontOpen = false;
let num = 0;
const HandWatch = (props) => {
  if (Platform.OS !== 'android') {
    return false;
  }
  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      _previousLeft = 0;
      num = 0;
      lastLeft = 0;
      dontOpen = true;
    },
    onPanResponderMove: (evt, gestureState) => {
      _previousLeft = lastLeft + gestureState.dx;
      num = 1;
    },
    onPanResponderRelease: (evt, gestureState) => {
      lastLeft = _previousLeft;
      if (_previousLeft < 0 + 12 && _previousLeft > 0 - 12) {
        if (num === 1) {
          _previousLeft = 0;
          dontOpen = false;
          goto();
        }
        num = 0;
        return;
      }
      dontOpen = false;
      _previousLeft = 0;
      lastLeft = 0;
      num = 0;


    },
  });
  let { data, date } = props;
  const navigation = useNavigation();
  function goto() {
    if (!dontOpen) {
      data.matchTypeId = 1;
      EventBus.removeListenser('evtNofityToMatchListPage');
      navigation.navigate('CompetitionDetail', { ...data, date });
    }
    
  }
 
  if (Platform.OS !== 'android') {
    return <View {...props.style} >{props.children}</View>;
  }
  return (
    <View {..._panResponder.panHandlers} >
      <ListItem {...props} dontOpen={dontOpen} />
    </View>
  );
};
export default HandWatch;
