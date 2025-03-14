import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from '../../styles/RecommendEmergency/RecommendEmergencyListStyles';

const EmergencyData = [
  {
    name: '서울적십자병원 응급실',
    number: '02-2002-8888',
    time: '10분',
    distance: '1.2km',
    address: '서울특별시 종로구 평동 164',
  },
  {
    name: '강북삼성병원 응급실',
    number: '02-2001-1000',
    time: '20분',
    distance: '1.5km',
    address: '서울특별시 종로구 새문안로 29 (평동)',
  },
  {
    name: '세브란스병원 응급진료센터',
    number: '02-2227-7777',
    time: '30분',
    distance: '2.0km',
    address: '서울특별시 서대문구 연세로 50-1 세브란스병원',
  },
  {
    name: '신촌연세병원 응급실',
    number: '02-337-7582',
    time: '40분',
    distance: '2.5km',
    address: '서울특별시 마포구 서강로 110(신수동)',
  },
  {
    name: '순천향대학서울병원 응급실',
    number: '02-709-91118',
    time: '50분',
    distance: '3.0km',
    address: '서울특별시 용산구 한남동 대사관로 59',
  },
];

const RecommendEmergencyListScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {/* Emergency List */}
      <ScrollView style={styles.EmergencyList}>
        {EmergencyData.map((Emergency, index) => (
          <View key={index} style={styles.EmergencyContainer}>
            <Text style={styles.EmergencyName}>{Emergency.name}</Text>
            <Text style={styles.EmergencyNumber}>{Emergency.number}</Text>
            <Text style={styles.EmergencyInfo}>
              {Emergency.time} | {Emergency.distance}
            </Text>
            <Text style={styles.EmergencyAddress}>{Emergency.address}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecommendEmergencyListScreen;
