import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/hospital';

const RecommendHospitalListScreen = ({route, navigation}) => {
  const {selectedDepartment} = route.params;
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📌 선택된 진료과:', selectedDepartment);

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        try {
          // ✅ 액세스 토큰 가져오기 및 확인
          const accessToken = await AsyncStorage.getItem('accessToken');
          console.log('✅ 액세스 토큰:', accessToken);

          if (!accessToken) {
            throw new Error('❌ 액세스 토큰이 없습니다.');
          }

          // ✅ API 요청 데이터 구성
          const requestData = {
            lat: parseFloat(latitude),
            lon: parseFloat(longitude),
            is_report: false,
            report_id: '',
            department: selectedDepartment, // ✅ 선택한 진료과 title을 그대로 사용
            suspected_disease: [''],
            secondary_hospital: true,
            tertiary_hospital: true,
          };

          console.log('📌 API 요청 파라미터:', requestData);

          // ✅ API 요청 (디버깅 추가)
          const response = await axios.post(API_URL, requestData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log('✅ 병원 데이터 수신:', response.data);
          setHospitals(response.data);
        } catch (err) {
          console.error('❌ 병원 추천 API 요청 실패:', err.message);

          if (err.response) {
            console.log('📌 서버 응답 상태 코드:', err.response.status);
            console.log(
              '📌 서버 응답 데이터:',
              JSON.stringify(err.response.data, null, 2),
            );
          } else {
            console.log('📌 응답 없음 (서버 응답이 undefined)');
          }

          setError(`데이터를 불러오는 데 실패했습니다: ${err.message}`);
        } finally {
          setLoading(false);
        }
      },
      error => {
        console.error('❌ 위치 정보를 가져오는 데 실패했습니다.', error);
        setError('위치 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [selectedDepartment]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.hospitalList}>
        {hospitals.map((hospital, index) => (
          <View key={index} style={styles.hospitalContainer}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalInfo}>{hospital.address}</Text>
            <Text style={styles.hospitalInfo}>
              🚆 이동 거리:{' '}
              {hospital.transit_travel_distance_km?.toFixed(1) || '-'} km
            </Text>
            <Text style={styles.hospitalInfo}>
              ⏳ 예상 소요 시간: {hospital.transit_travel_time_m || '-'} 분
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecommendHospitalListScreen;
