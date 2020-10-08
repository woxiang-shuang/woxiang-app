import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { dateFormat, getDayCountOfMonth } from '../../utils/date';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';

const WeekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getCurWeekDay(date) {
  let curWeekDay = date.getDay();
  return WeekDays[curWeekDay];
}

function getDateOfMonth(date) {
  return dateFormat(date, 'yyyy-MM-dd');
}

function getOneWeekDates(date, beforeWeek) {
  let curDate = date.getDate();
  let oneWeekDates = [];
  let maxDateOfCurMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
  for (let i = 0; i < 7; i++) {
    date.setDate(curDate);
    oneWeekDates.push({
      day: getCurWeekDay(date),
      date: getDateOfMonth(date)
    });
    if (beforeWeek === true) {
      curDate--;
      // 上一月
      if (curDate < 1) {
        let lastMonth = date.getMonth() - 1;
        if (lastMonth < 0) {
          lastMonth = 11;
          date.setFullYear(date.getFullYear() - 1);
        }
        date.setMonth(lastMonth);
        curDate = maxDateOfCurMonth = getDayCountOfMonth(date.getFullYear(), lastMonth);
      }
    } else {
      curDate++;
      // 下一月
      if (curDate > maxDateOfCurMonth) {
        curDate = 1;
        let nextMonth = date.getMonth() + 1;
        if (nextMonth > 11) {
          nextMonth = 1;
          date.setFullYear(date.getFullYear() + 1);
        }
        date.setDate(curDate);
        date.setMonth(nextMonth);
        maxDateOfCurMonth = getDayCountOfMonth(date.getFullYear(), nextMonth);
      }
    }
  }
  if (beforeWeek === true) {
    oneWeekDates.reverse();
  }
  return oneWeekDates;
}

function fmtDateStr(dateStr = '') {
  return dateStr.substring(dateStr.indexOf('-') + 1);
}

export function getCurDate(date) {
  return getDateOfMonth(date || new Date());
}

function WeekHeader(props) {
  let [curIndex, setCurIndex] = useState(0);
  let d = props.date || new Date();
  let [oneWeekDates] = useState(getOneWeekDates(d, props.beforeWeek));
  useEffect(() => {
    if (props.beforeWeek) {
      setCurIndex(oneWeekDates.length - 1);
      props.onLoad && props.onLoad(oneWeekDates[oneWeekDates.length - 1]);
    } else {
      setCurIndex(0);
      props.onLoad && props.onLoad(oneWeekDates[0]);
    }
  }, [props.updateFlag]);
  function weekItemHandler(wd, i) {
    setCurIndex(i);
    props.click(wd, i);
  }
  return (
    <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.pdL10, cstyle.pdR10, styles.container]}>
      {oneWeekDates.map((item, i) => (
        <View key={i} style={[cstyle.flex1, cstyle.flexDirecC, styles.weekItem]}>
          <TouchableOpacity onPress={() => weekItemHandler(item, i)} style={cstyle.flex1}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiFe, cstyle.flexJcC, cstyle.flex1]}><Text style={curIndex === i ? styles.active : styles.unactive}>{fmtDateStr(item.date)}</Text></View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]}><Text style={curIndex === i ? styles.active : styles.unactive}>{item.day}</Text></View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export default WeekHeader;

const styles = StyleSheet.create({
  container: {
    height: px(66),
    borderBottomWidth: 1,
    borderColor: theme.border.color3,
    backgroundColor: theme.background.color8
  },
  weekItem: {
    height: px(66)
  },
  unactive: {
    color: theme.text.color8,
    fontSize: px(22)
  },
  active: {
    color: theme.text.color6,
    fontSize: px(22)
  }
});
