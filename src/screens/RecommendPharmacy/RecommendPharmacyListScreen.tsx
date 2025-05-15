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
import {useTranslation} from 'react-i18next';
import styles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const API_URL = 'http://52.78.79.53:8081/api/v1/pharmacy';
const MAP_API_URL = 'http://52.78.79.53:8081/api/v1/pharmacy-map';

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapUrls, setMapUrls] = useState(null);
  const [location, setLocation] = useState({latitude: null, longitude: null});

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '근처 약국 추천을 위해 위치 정보가 필요합니다.',
          buttonNeutral: '나중에 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

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
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchPharmacies(location.latitude, location.longitude);
    }
  }, [location]);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error(t('액세스 토큰이 없습니다.'));
      }
      return token;
    } catch (error) {
      Alert.alert(t('로그인이 필요합니다.'));
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
      const requestData = {lat, lon};
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
      Alert.alert(t('서버 요청 중 오류가 발생했습니다.'));
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
      console.log('✅ 지도 데이터 수신:', data);
      setMapUrls(data.map_urls);

      showMapSelectionAlert(data.map_urls);
    } catch (error) {
      Alert.alert(t('지도 데이터를 가져오는 중 오류가 발생했습니다.'));
    }
  };

  const showMapSelectionAlert = urls => {
    const options = [];

    if (urls.naver_map) {
      options.push({
        text: 'Naver',
        onPress: () => Linking.openURL(urls.naver_map),
      });
    }
    if (urls.kakao_map) {
      options.push({
        text: 'Kakao',
        onPress: () => Linking.openURL(urls.kakao_map),
      });
    }
    if (urls.google_map) {
      options.push({
        text: 'Google',
        onPress: () => Linking.openURL(urls.google_map),
      });
    }

    if (options.length > 0) {
      Alert.alert(
        t('지도 선택'),
        t('어떤 지도를 사용하시겠습니까?'),
        [...options, {text: t('취소'), style: 'cancel'}],
        {cancelable: true},
      );
    } else {
      Alert.alert(t('오류'), t('이용 가능한 지도 URL이 없습니다.'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {t(
          '가까운 위치에 있는 약국을 추천해드립니다\n운영 시간과 예상 소요 시간을 참고해주세요.',
        )}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2527BF" />
      ) : pharmacies.length === 0 ? (
        <Text style={styles.noPharmaciesText}>
          {t('근처 약국을 찾을 수 없습니다.')}
        </Text>
      ) : (
        <ScrollView style={styles.pharmacyList}>
          {pharmacies.map((pharmacy, index) => (
            <TouchableOpacity
              key={index}
              style={styles.pharmacyCard}
              onPress={() => fetchPharmacyMapUrl(pharmacy.id)}>
              <View style={styles.pharmacyCardContent}>
                <Text style={styles.pharmacyName}>{pharmacy.dutyname}</Text>

                <Text style={styles.pharmacyLabel}>{t('전화 번호')}</Text>
                <Text style={styles.pharmacyInfo}>
                  {pharmacy.dutytel1 || t('정보 없음')}
                </Text>

                <Text style={styles.pharmacyLabel}>{t('주소')}</Text>
                <Text style={styles.pharmacyInfo}>
                  {pharmacy.address || t('정보 없음')}
                </Text>

                <Text style={styles.pharmacyLabel}>{t('이동 거리')}</Text>
                <Text style={styles.pharmacyInfo}>
                  {pharmacy.transit_travel_distance_km?.toFixed(2) || '-'} km
                </Text>

                <Text style={styles.pharmacyLabel}>{t('예상 소요 시간')}</Text>
                <Text style={styles.pharmacyInfo}>
                  {pharmacy.transit_travel_time_m || '-'} {t('분')}
                </Text>

                <Text style={styles.pharmacyLabel}>{t('운영 시간')}</Text>
                {['월', '화', '수', '목', '금', '토', '일', '공휴일'].map(
                  (day, i) => {
                    const start = pharmacy[`dutytime${i + 1}s`];
                    const close = pharmacy[`dutytime${i + 1}c`];
                    return start && close ? (
                      <Text key={i} style={styles.hoursText}>
                        {t(day)}: {start} - {close}
                      </Text>
                    ) : null;
                  },
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendPharmacyListScreen;
