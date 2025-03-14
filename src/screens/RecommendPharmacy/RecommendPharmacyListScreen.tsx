import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RecommendPharmacyListStyles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
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
      const response = await fetch('http://52.78.79.53:8081/api/v1/pharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({lat, lon}),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      Alert.alert('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(`📍 현재 위치: ${latitude}, ${longitude}`);
        fetchPharmacies(latitude, longitude);
      },
      error => {
        console.error('❌ 위치 정보를 가져오는 데 실패:', error);
        fetchPharmacies(37.54589035287757, 126.96360809538088);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

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
    } else {
      const status = await Geolocation.requestAuthorization('whenInUse');
      if (status !== 'granted') {
        Alert.alert('위치 권한이 필요합니다.');
        setLoading(false);
        return;
      }
    }
    getCurrentLocation();
  };

  const fetchPharmacyMapUrl = async pharmacyId => {
    const token = await getAccessToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/pharmacy-map/${pharmacyId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
