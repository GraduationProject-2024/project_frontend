import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next'; // ✅ 번역 훅 추가
import styles from '../../styles/RecommendEmergency/RecommendEmergencyListStyles';

const RecommendEmergencyListScreen = () => {
  const {t} = useTranslation(); // ✅ 번역 훅 사용
  const [emergencyList, setEmergencyList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('위치 권한 필요'),
            message: t('이 앱은 응급실 추천을 위해 위치 정보를 사용합니다.'),
            buttonNeutral: t('나중에'),
            buttonNegative: t('거부'),
            buttonPositive: t('허용'),
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
        console.error(t('위치 정보를 가져올 수 없습니다:'), error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const conditions = await AsyncStorage.getItem('selectedConditions');
      return {
        token: token || null,
        conditions: conditions ? JSON.parse(conditions) : [],
      };
    } catch (error) {
      console.error(t('저장된 데이터를 가져오는 중 오류 발생:'), error);
      return {token: null, conditions: []};
    }
  };

  const fetchEmergencyList = async () => {
    setLoading(true);
    try {
      const {token, conditions} = await getStoredData();
      const isCondition = conditions.length > 0;

      if (latitude === null || longitude === null) {
        console.warn(t('위치 정보를 가져오지 못했습니다.'));
        return;
      }

      const response = await fetch('http://52.78.79.53:8081/api/v1/er', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}),
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
      console.log(t('응급실 추천 리스트:'), data);

      setEmergencyList(
        data.map((item: any) => ({
          id: item.id,
          name: item.dutyName,
          number: item.dutyTel3 || t('번호 없음'),
          time: `${item.transit_travel_time_m}${t('분')}`,
          distance: `${item.transit_travel_distance_km}${t('km')}`,
          address: item.dutyAddr,
        })),
      );
    } catch (error) {
      console.error(t('응급실 목록을 가져오는 중 오류 발생:'), error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmergencyMap = async (erId: number) => {
    try {
      const {token} = await getStoredData();

      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/er-map/${erId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(t('응급실 지도 정보:'), data);

      Alert.alert(
        t('지도 선택'),
        t('어떤 지도에서 응급실 위치를 확인하시겠습니까?'),
        [
          {
            text: t('네이버 지도'),
            onPress: () => Linking.openURL(data.map_urls.naver_map),
          },
          {
            text: t('카카오 지도'),
            onPress: () => Linking.openURL(data.map_urls.kakao_map),
          },
          {
            text: t('구글 지도'),
            onPress: () => Linking.openURL(data.map_urls.google_map),
          },
          {text: t('취소'), style: 'cancel'},
        ],
        {cancelable: true},
      );
    } catch (error) {
      console.error(t('응급실 지도 정보를 가져오는 중 오류 발생:'), error);
    }
  };

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
            <TouchableOpacity
              key={index}
              onPress={() => fetchEmergencyMap(Emergency.id)}>
              <View style={styles.EmergencyContainer}>
                <Text style={styles.EmergencyName}>{Emergency.name}</Text>
                <Text style={styles.EmergencyNumber}>{Emergency.number}</Text>
                <Text style={styles.EmergencyInfo}>
                  {Emergency.time} | {Emergency.distance}
                </Text>
                <Text style={styles.EmergencyAddress}>{Emergency.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendEmergencyListScreen;
