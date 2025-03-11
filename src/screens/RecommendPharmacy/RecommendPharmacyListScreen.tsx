import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecommendPharmacyListStyles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // 📌 1️⃣ 위치 권한 요청
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('위치 권한이 필요합니다.');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ 위치 권한 요청 오류:', error);
        Alert.alert('위치 권한 요청 실패');
        setLoading(false);
        return;
      }
    } else if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      if (status !== 'granted') {
        Alert.alert('위치 권한이 필요합니다.');
        setLoading(false);
        return;
      }
    }

    getCurrentLocation();
  };

  // 📌 2️⃣ 현재 위치 가져오기
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('✅ 위치 가져오기 성공:', {latitude, longitude});

        if (!latitude || !longitude) {
          console.error('❌ 위도/경도 값이 없음');
          Alert.alert('위치 정보를 가져올 수 없습니다.');
          return;
        }

        setLocation({latitude, longitude});
        fetchPharmacies(latitude, longitude);
      },
      error => {
        console.error('❌ 위치 정보를 가져오는 데 실패:', error);
        Alert.alert('위치 정보를 가져올 수 없습니다.');

        // 기본 좌표(서울 시청)로 요청
        fetchPharmacies(37.5665, 126.978);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // 📌 3️⃣ 액세스 토큰 가져오기
  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('액세스 토큰이 없습니다.');
      }
      return token;
    } catch (error) {
      console.error('❌ 액세스 토큰 가져오기 오류:', error);
      Alert.alert('로그인이 필요합니다.');
      setLoading(false);
      return null;
    }
  };

  // 📌 4️⃣ API 요청
  const fetchPharmacies = async (lat, lon) => {
    console.log('📡 요청 데이터:', {lat, lon});

    if (!lat || !lon) {
      console.error('❌ 위도/경도 값이 없습니다.');
      Alert.alert('위치 정보를 가져올 수 없습니다.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://52.78.79.53:8081/api/v1/pharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({lat, lon}),
      });

      console.log('📩 응답 상태 코드:', response.status);

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('📩 API 응답 데이터:', data);

      if (!data || data.length === 0) {
        Alert.alert('📢 근처 약국 정보를 찾을 수 없습니다.');
      }

      setPharmacies(data);
    } catch (error) {
      console.error('❌ API 호출 오류:', error);
      Alert.alert('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={RecommendPharmacyListStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {pharmacies.length > 0 ? (
            pharmacies.map((pharmacy, index) => (
              <View
                key={index}
                style={RecommendPharmacyListStyles.pharmacyContainer}>
                <Text style={RecommendPharmacyListStyles.pharmacyName}>
                  {pharmacy.dutyname}
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyAddress}>
                  {pharmacy.address}
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                  전화번호: {pharmacy.dutytel1 || '정보 없음'}
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                  거리: {pharmacy.transit_travel_distance_km?.toFixed(2)} km
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                  예상 이동 시간: {pharmacy.transit_travel_time_m} 분
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyHours}>
                  운영 시간:
                  {pharmacy.dutytime1s && pharmacy.dutytime1c
                    ? ` 월 ${pharmacy.dutytime1s} - ${pharmacy.dutytime1c}`
                    : ''}
                  {pharmacy.dutytime2s && pharmacy.dutytime2c
                    ? ` 화 ${pharmacy.dutytime2s} - ${pharmacy.dutytime2c}`
                    : ''}
                  {pharmacy.dutytime3s && pharmacy.dutytime3c
                    ? ` 수 ${pharmacy.dutytime3s} - ${pharmacy.dutytime3c}`
                    : ''}
                  {pharmacy.dutytime4s && pharmacy.dutytime4c
                    ? ` 목 ${pharmacy.dutytime4s} - ${pharmacy.dutytime4c}`
                    : ''}
                  {pharmacy.dutytime5s && pharmacy.dutytime5c
                    ? ` 금 ${pharmacy.dutytime5s} - ${pharmacy.dutytime5c}`
                    : ''}
                  {pharmacy.dutytime6s && pharmacy.dutytime6c
                    ? ` 토 ${pharmacy.dutytime6s} - ${pharmacy.dutytime6c}`
                    : ''}
                  {pharmacy.dutytime7s && pharmacy.dutytime7c
                    ? ` 일 ${pharmacy.dutytime7s} - ${pharmacy.dutytime7c}`
                    : ''}
                  {pharmacy.dutytime8s && pharmacy.dutytime8c
                    ? ` 공휴일 ${pharmacy.dutytime8s} - ${pharmacy.dutytime8c}`
                    : ''}
                </Text>
              </View>
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
