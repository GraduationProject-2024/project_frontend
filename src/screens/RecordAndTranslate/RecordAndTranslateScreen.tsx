import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import RecordAndTranslateStyles from '../../styles/RecordAndTranslate/RecordAndTranslateStyles';

const recordings = [
  {
    id: '1',
    title: '음성녹음 1',
    duration: '05:10',
    date: '2025년 01월 15일 오전 10:50',
  },
  {
    id: '2',
    title: '음성녹음 2',
    duration: '05:00',
    date: '2025년 01월 08일 오후 1:30',
  },
  {
    id: '3',
    title: '음성녹음 3',
    duration: '07:20',
    date: '2025년 01월 01일 오후 4:20',
  },
  {
    id: '4',
    title: '음성녹음 4',
    duration: '10:00',
    date: '2024년 12월 25일 오전 11:50',
  },
  {
    id: '5',
    title: '음성녹음 5',
    duration: '08:24',
    date: '2024년 12월 18일 오후 3:20',
  },
];

const RecordAndTranslateScreen = () => {
  const renderItem = ({item}: {item: (typeof recordings)[0]}) => (
    <View style={RecordAndTranslateStyles.itemContainer}>
      <Image
        source={require('../../img/RecordAndTranslate/PlayButton.png')}
        style={RecordAndTranslateStyles.icon}
      />
      <View style={RecordAndTranslateStyles.textContainer}>
        <Text style={RecordAndTranslateStyles.title}>{item.title}</Text>
        <View style={RecordAndTranslateStyles.subtitleContainer}>
          <Text style={RecordAndTranslateStyles.duration}>{item.duration}</Text>
          <Text style={RecordAndTranslateStyles.date}>{item.date}</Text>
        </View>
      </View>
      <Image
        source={require('../../img/RecordAndTranslate/MenuButton.png')}
        style={RecordAndTranslateStyles.menuIcon}
      />
    </View>
  );

  return (
    <View style={RecordAndTranslateStyles.container}>
      <Text style={RecordAndTranslateStyles.header}>음성 녹음 목록</Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={RecordAndTranslateStyles.listContainer}
      />
      <TouchableOpacity style={RecordAndTranslateStyles.button}>
        <Text style={RecordAndTranslateStyles.buttonText}>
          음성 녹음 시작하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecordAndTranslateScreen;
