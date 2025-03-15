import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service'; // ✅ Geolocation 추가
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/RecommendEmergency/RecommendEmergencyListStyles';

const RecommendEmergencyListScreen = () => {
  const [emergencyList, setEmergencyList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigation = useNavigation();

  // 🔹 위치 권한 요청 (Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 필요',
            message: '이 앱은 응급실 추천을 위해 위치 정보를 사용합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // 🔹 현재 위치 가져오기
  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // 🔹 비동기로 토큰 및 특수 상태 가져오기
  const getStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const conditions = await AsyncStorage.getItem('selectedConditions');
      return {
        token: token || null,
        conditions: conditions ? JSON.parse(conditions) : [],
      };
    } catch (error) {
      console.error('Error fetching stored data:', error);
      return {token: null, conditions: []};
    }
  };

  // 🔹 응급실 추천 API 요청
  const fetchEmergencyList = async () => {
    setLoading(true);
    try {
      const {token, conditions} = await getStoredData();
      const isCondition = conditions.length > 0; // ✅ 특수 상태 값 여부 설정

      if (latitude === null || longitude === null) {
        console.warn('위치 정보를 가져오지 못했습니다.');
        return;
      }

      const response = await fetch('http://52.78.79.53:8081/api/v1/er', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}), // ✅ 토큰 추가
        },
        body: JSON.stringify({
          isCondition: isCondition,
          conditions: conditions,
          lat: latitude,
          lon: longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('응급실 추천 리스트:', data);

      setEmergencyList(
        data.map((item: any) => ({
          name: item.dutyName,
          number: item.dutyTel3 || '번호 없음',
          time: `${item.transit_travel_time_m}분`,
          distance: `${item.transit_travel_distance_km}km`,
          address: item.dutyAddr,
        })),
      );
    } catch (error) {
      console.error('Error fetching emergency list:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 위치 가져온 후 응급실 리스트 요청
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchEmergencyList();
    }
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.EmergencyList}>
          {emergencyList.map((Emergency, index) => (
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
      )}
    </View>
  );
};

export default RecommendEmergencyListScreen;
