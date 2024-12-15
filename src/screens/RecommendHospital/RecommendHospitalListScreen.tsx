import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const hospitalData = [
  {
    name: '하나이비인후과의원',
    time: '2분',
    distance: '100m',
    address: '서울 용산구 청파로47길 66 중앙빌딩 1층 (청파동2가)',
  },
  {
    name: '제일성모이비인후과의원',
    time: '3분',
    distance: '150m',
    address: '서울 용산구 청파로47길 53 1층 (청파동3가)',
  },
  {
    name: '연세맑은이비인후과의원 회현점',
    time: '4분',
    distance: '200m',
    address: '서울 용산구 청파로47길 40 (청파동2가)',
  },
  {
    name: '연세이비인후과의원',
    time: '5분',
    distance: '250m',
    address: '서울 용산구 장문로93길 2 1층 (청파동2가)',
  },
  {
    name: '보아스이비인후과의원',
    time: '6분',
    distance: '300m',
    address: '서울 용산구 장문로93길 2층 201호 (후암동 288)',
  },
  {
    name: '서울센트럴이비인후과의원',
    time: '2분',
    distance: '100m',
    address: '서울 용산구 청파로47길 66 중앙빌딩 1층 (청파동2가)',
  },
  {
    name: '열린이비인후과의원',
    time: '3분',
    distance: '150m',
    address: '서울 용산구 청파로47길 53 1층 (청파동3가)',
  },
  {
    name: '열린이비인후과의원',
    time: '4분',
    distance: '200m',
    address: '서울 용산구 청파로47길 40 (청파동2가)',
  },
];

const RecommendHospitalListScreen = () => {
  const [selectedTab, setSelectedTab] = useState('영업 중');

  const handleTabPress = tab => {
    setSelectedTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>병원 추천</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['영업 중', '휴일 영업', '야간 영업'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress(tab)}>
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === tab && styles.activeTabButtonText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hospital List */}
      <ScrollView style={styles.hospitalList}>
        {hospitalData.map((hospital, index) => (
          <View key={index} style={styles.hospitalItem}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalDistance}>
              {hospital.time} | {hospital.distance}
            </Text>
            <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Map Button */}
      <TouchableOpacity style={styles.mapButton}>
        <Text style={styles.mapButtonText}>지도로 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendHospitalListScreen;
