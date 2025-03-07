import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const hospitalData = [
  {
    name: '하나이비인후과의원',
    time: '12분',
    distance: '1.2km',
    address: '서울 용산구 한강대로 297 2층 (갈월동)',
  },
  {
    name: '연세이비인후과의원',
    time: '15분',
    distance: '1.5km',
    address: '서울 용산구 만리재로 134 힐타워빌딩 4층 (서계동)',
  },
  {
    name: '제일성모이비인후과의원',
    time: '20분',
    distance: '2.0km',
    address: '서울 용산구 백범로 341 리첸시아 용산 A동 1층 128호',
  },
  {
    name: '보아스이비인후과의원',
    time: '25분',
    distance: '2.5km',
    address: '서울 마포구 마포대로24길 56 보령빌딩 6층 (아현동)',
  },
  {
    name: '공덕연세이비인후과의원',
    time: '30분',
    distance: '3.0km',
    address: '서울 마포구 마포대로 92 효성해링턴스퀘어 B동 5층 504호',
  },
  {
    name: '김이비인후과의원',
    time: '30분',
    distance: '3.0km',
    address: '서울 마포구 만리재로 15 제일빌딩 303호 (공덕동)',
  },
  {
    name: '연세소리이비인후과의원',
    time: '35분',
    distance: '3.5km',
    address: '서울 마포구 백범로31길 8 공덕SK리더스뷰 2층 203-205호',
  },
];

const RecommendHospitalListScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {/* Hospital List */}
      <ScrollView style={styles.hospitalList}>
        {hospitalData.map((hospital, index) => (
          <View key={index} style={styles.hospitalContainer}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalInfo}>
              {hospital.time} | {hospital.distance}
            </Text>
            <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecommendHospitalListScreen;
