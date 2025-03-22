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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next'; // ✅ 번역 훅 추가
import styles from '../../styles/RecommendEmergency/RecommendEmergencyListStyles';

const RecommendEmergencyListScreen = () => {
  const {t} = useTranslation(); // ✅ 번역 훅 사용
  const [emergencyList, setEmergencyList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  // ✅ 고정된 위도, 경도 설정 (서울특별시 용산구 한강대로 366 근처)
  const latitude = 37.546584;
  const longitude = 126.964649;

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

      const response = await fetch('http://52.78.79.53:8081/api/v1/er', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify({
          isCondition: isCondition,
          conditions: conditions,
          lat: latitude, // ✅ 고정된 값 사용
          lon: longitude, // ✅ 고정된 값 사용
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
    fetchEmergencyList();
  }, []);

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
