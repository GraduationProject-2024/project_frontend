import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import styles from '../../styles/RecommendEmergency/RecommendEmergencyListStyles';

const RecommendEmergencyListScreen = () => {
  const {t} = useTranslation();
  const [emergencyList, setEmergencyList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({latitude: null, longitude: null});
  const navigation = useNavigation();

  // 위치 권한 요청 함수
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t('위치 권한 요청'),
          message: t('근처 응급실 추천을 위해 위치 정보가 필요합니다.'),
          buttonNeutral: t('나중에 묻기'),
          buttonNegative: t('취소'),
          buttonPositive: t('확인'),
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS는 Info.plist에 권한 설명만 있으면 자동 요청됨
    return true;
  };

  // 현재 위치 받아오기
  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(t('위치 권한이 필요합니다.'));
        setLoading(false);
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          Alert.alert(t('위치 정보를 가져오지 못했습니다.'));
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 위치가 준비되면 응급실 리스트 조회
  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchEmergencyList(location.latitude, location.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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

  // 위도, 경도를 파라미터로 받도록 수정
  const fetchEmergencyList = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const {token, conditions} = await getStoredData();
      const isCondition = conditions.length > 0;

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
          time: `${item.transit_travel_time_m} ${t('분')}`,
          distance: `${item.transit_travel_distance_km} ${t('km')}`,
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

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {t(
          '가까운 위치에 있는 응급실을 추천해드립니다\n운영 시간과 예상 소요 시간을 참고해주세요\n원하는 응급실을 눌러 지도를 확인하세요',
        )}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2527BF" />
      ) : (
        <ScrollView style={styles.EmergencyList}>
          {emergencyList.map((Emergency, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emergencyCard}
              onPress={() => fetchEmergencyMap(Emergency.id)}>
              <View style={styles.emergencyCardContent}>
                <Text style={styles.emergencyName}>{Emergency.name}</Text>
                <Text style={styles.emergencyLabel}>{t('전화 번호')}</Text>
                <Text style={styles.emergencyInfo}>{Emergency.number}</Text>

                <Text style={styles.emergencyLabel}>{t('주소')}</Text>
                <Text style={styles.emergencyInfo}>{Emergency.address}</Text>

                <Text style={styles.emergencyLabel}>{t('이동 거리')}</Text>
                <Text style={styles.emergencyInfo}>{Emergency.distance}</Text>

                <Text style={styles.emergencyLabel}>{t('예상 소요 시간')}</Text>
                <Text style={styles.emergencyInfo}>{Emergency.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendEmergencyListScreen;
