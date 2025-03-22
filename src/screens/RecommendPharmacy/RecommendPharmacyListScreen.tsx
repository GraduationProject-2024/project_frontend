import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RecommendPharmacyListStyles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/pharmacy';
const MAP_API_URL = 'http://52.78.79.53:8081/api/v1/pharmacy-map';

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 고정된 위도, 경도 설정 (서울특별시 용산구 한강대로 366 근처)
  const latitude = 37.546584;
  const longitude = 126.964649;

  useEffect(() => {
    fetchPharmacies(latitude, longitude);
  }, []);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('액세스 토큰이 없습니다.');
      }
      return token;
    } catch (error) {
      Alert.alert('로그인이 필요합니다.');
      setLoading(false);
      return null;
    }
  };

  const fetchPharmacies = async (lat, lon) => {
    const token = await getAccessToken();
    if (!token) {
      return;
    }

    try {
      const requestData = {lat, lon}; // ✅ 고정된 위도, 경도 사용
      console.log('📌 약국 조회 요청 데이터:', requestData);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 약국 데이터 수신:', data);
      setPharmacies(data);
    } catch (error) {
      console.error('❌ 약국 API 요청 실패:', error.message);
      Alert.alert('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacyMapUrl = async pharmacyId => {
    const token = await getAccessToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${MAP_API_URL}/${pharmacyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      const mapUrls = data.map_urls;
      if (mapUrls.google_map) {
        Linking.openURL(mapUrls.google_map);
      } else {
        Alert.alert('지도 URL을 가져올 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('지도 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={RecommendPharmacyListStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={RecommendPharmacyListStyles.pharmacyList}>
          {pharmacies.length > 0 ? (
            pharmacies.map((pharmacy, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => fetchPharmacyMapUrl(pharmacy.id)}>
                <View style={RecommendPharmacyListStyles.pharmacyContainer}>
                  <Text style={RecommendPharmacyListStyles.pharmacyName}>
                    {pharmacy.dutyname}
                  </Text>
                  <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                    <Icon name="place" size={16} color="gray" />{' '}
                    {pharmacy.address}
                  </Text>
                  <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                    <Icon name="call" size={16} color="gray" />
                    전화번호: {pharmacy.dutytel1 || '정보 없음'}
                  </Text>
                  <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                    <Icon name="directions-walk" size={16} color="gray" /> 거리:{' '}
                    {pharmacy.transit_travel_distance_km?.toFixed(2)} km
                  </Text>
                  <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                    <Icon name="timer" size={16} color="gray" />
                    예상 이동 시간: {pharmacy.transit_travel_time_m} 분
                  </Text>
                  <Text style={RecommendPharmacyListStyles.pharmacyHours}>
                    운영 시간:
                  </Text>
                  {['월', '화', '수', '목', '금', '토', '일', '공휴일'].map(
                    (day, i) => {
                      const start = pharmacy[`dutytime${i + 1}s`];
                      const close = pharmacy[`dutytime${i + 1}c`];
                      return start && close ? (
                        <Text
                          key={i}
                          style={RecommendPharmacyListStyles.hoursText}>
                          {day}: {start} - {close}
                        </Text>
                      ) : null;
                    },
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              근처 약국을 찾을 수 없습니다.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendPharmacyListScreen;
