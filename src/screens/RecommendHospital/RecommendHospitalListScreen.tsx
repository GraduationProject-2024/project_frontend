import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const hospitalData = [
  {
    name: '하나이비인후과의원',
    time: '12분',
    address: '서울 용산구 한강대로 297 2층 (갈월동)',
  },
  {
    name: '연세이비인후과의원',
    time: '15분',
    address: '서울 용산구 만리재로 134 힐타워빌딩 4층 (서계동)',
  },
  {
    name: '제일성모이비인후과의원',
    time: '20분',
    address: '서울 용산구 백범로 341 리첸시아 용산 A동 1층 128호',
  },
  {
    name: '보아스이비인후과의원',
    time: '25분',
    address: '서울 마포구 마포대로24길 56 보령빌딩 6층 (아현동)',
  },
  {
    name: '공덕연세이비인후과의원',
    time: '30분',
    address: '서울 마포구 마포대로 92 효성해링턴스퀘어 B동 5층 504호',
  },
  {
    name: '김이비인후과의원',
    time: '30분',
    address: '서울 마포구 만리재로 15 제일빌딩 303호 (공덕동)',
  },
  {
    name: '연세소리이비인후과의원',
    time: '35분',
    address: '서울 마포구 백범로31길 8 공덕SK리더스뷰 2층 203-205호',
  },
];

const RecommendHospitalListScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          눈송이 님 위치 기반으로 추천해주는 병원입니다
        </Text>
      </View>

      {/* Hospital List */}
      <ScrollView style={styles.hospitalList}>
        {hospitalData.map((hospital, index) => (
          <View key={index} style={styles.hospitalItem}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalDistance}>{hospital.time}</Text>
            <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Map Button */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => navigation.navigate('RecommendHospitalMap')} // Navigate to Map Screen
      >
        <Text style={styles.mapButtonText}>지도로 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendHospitalListScreen;
