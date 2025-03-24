import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/hospital';
const MAP_API_URL = 'http://52.78.79.53:8081/api/v1/hospital-map';

const RecommendHospitalListScreen = ({route, navigation}) => {
  const {selectedDepartment} = route.params;
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapUrls, setMapUrls] = useState(null);

  // ✅ 고정된 위도, 경도 설정 (서울특별시 용산구 한강대로 366 근처)
  const latitude = 37.546584;
  const longitude = 126.964649;

  useEffect(() => {
    console.log('📌 선택된 진료과:', selectedDepartment);
    console.log('📍 고정된 위치: 위도', latitude, '경도', longitude);

    const fetchHospitals = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log('✅ 액세스 토큰:', accessToken);

        if (!accessToken) {
          throw new Error('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const requestData = {
          lat: latitude, // ✅ 고정된 위도 사용
          lon: longitude, // ✅ 고정된 경도 사용
          is_report: false,
          report_id: '',
          department: selectedDepartment,
          suspected_disease: [''],
          secondary_hospital: true,
          tertiary_hospital: true,
        };

        console.log('📌 API 요청 파라미터:', requestData);

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
        setError(`데이터를 불러오는 데 실패했습니다: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [selectedDepartment]);

  const onHospitalSelect = async hospitalId => {
    try {
      setLoading(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.');
      }

      const response = await axios.get(`${MAP_API_URL}/${hospitalId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ 병원 상세 정보:', response.data);
      setSelectedHospital(response.data.hospital_info);
      setMapUrls(response.data.map_urls);
    } catch (err) {
      console.error('❌ 병원 지도 API 요청 실패:', err.message);

      if (err.response) {
        console.log('📌 서버 응답 상태 코드:', err.response.status);
        console.log(
          '📌 서버 응답 데이터:',
          JSON.stringify(err.response.data, null, 2),
        );

        if (err.response.status === 403) {
          setError('접근 권한이 없습니다. 다시 로그인해주세요.');
        } else {
          setError(`병원 정보를 불러오는 데 실패했습니다: ${err.message}`);
        }
      } else {
        setError('서버 응답이 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <Text style={styles.titleText}>
        선택하신 진료과에 맞는 병원을 추천해 드립니다{'\n'}
        이동 거리와 예상 소요 시간을 참고해주세요
      </Text>
      <ScrollView style={styles.hospitalList}>
        {hospitals.map((hospital, index) => (
          <TouchableOpacity
            key={index}
            style={styles.hospitalContainer}
            onPress={() => onHospitalSelect(hospital.id)}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            {hospital.telephone && (
              <Text style={styles.hospitalInfo}>☎️ {hospital.telephone}</Text>
            )}
            <Text style={styles.hospitalInfo}>{hospital.address}</Text>
            <Text style={styles.hospitalInfo}>
              🚆 이동 거리:{' '}
              {hospital.transit_travel_distance_km?.toFixed(1) || '-'} km
            </Text>
            <Text style={styles.hospitalInfo}>
              ⏳ 예상 소요 시간: {hospital.transit_travel_time_m || '-'} 분
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedHospital && (
        <View style={styles.selectedHospitalContainer}>
          <Text style={styles.hospitalName}>{selectedHospital.name}</Text>
          <Text style={styles.hospitalInfo}>
            ☎️ {selectedHospital.telephone}
          </Text>
          <Text style={styles.hospitalInfo}>📍 {selectedHospital.address}</Text>
          <View style={styles.mapLinks}>
            {mapUrls?.naver_map && (
              <TouchableOpacity
                onPress={() => Linking.openURL(mapUrls.naver_map)}>
                <Text style={styles.mapLinkText}>🗺️ 네이버 지도</Text>
              </TouchableOpacity>
            )}
            {mapUrls?.kakao_map && (
              <TouchableOpacity
                onPress={() => Linking.openURL(mapUrls.kakao_map)}>
                <Text style={styles.mapLinkText}>🗺️ 카카오 지도</Text>
              </TouchableOpacity>
            )}
            {mapUrls?.google_map && (
              <TouchableOpacity
                onPress={() => Linking.openURL(mapUrls.google_map)}>
                <Text style={styles.mapLinkText}>🗺️ 구글 지도</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default RecommendHospitalListScreen;
