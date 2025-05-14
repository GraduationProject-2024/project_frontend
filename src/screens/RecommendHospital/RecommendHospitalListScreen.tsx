import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';
import {Platform, PermissionsAndroid} from 'react-native';

const API_URL = 'http://52.78.79.53:8081/api/v1/hospital';
const MAP_API_URL = 'http://52.78.79.53:8081/api/v1/hospital-map';

const RecommendHospitalListScreen = ({route, navigation}) => {
  const {selectedDepartment} = route.params;
  const {t} = useTranslation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrls, setMapUrls] = useState(null);

  // 위치 상태 추가
  const [location, setLocation] = useState({latitude: null, longitude: null});

  // 위치 권한 요청 함수
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '병원 추천을 위해 위치 정보가 필요합니다.',
          buttonNeutral: '나중에 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS는 Info.plist에 권한 설명만 있으면 자동 요청됨
    return true;
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const fetchHospitals = async () => {
        try {
          setLoading(true);
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (!accessToken) {
            throw new Error(
              t('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.'),
            );
          }

          const requestData = {
            lat: location.latitude,
            lon: location.longitude,
            is_report: false,
            report_id: '',
            department: selectedDepartment,
            suspected_disease: [''],
            secondary_hospital: false,
            tertiary_hospital: false,
          };

          const response = await axios.post(API_URL, requestData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setHospitals(response.data);
        } catch (err) {
          setError(`${t('데이터를 불러오는 데 실패했습니다')}: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchHospitals();
    }
  }, [location, selectedDepartment]);

  // 위치 받아오기
  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError(t('위치 권한이 필요합니다.'));
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
          setError(t('위치 정보를 가져오지 못했습니다.'));
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };
    getLocation();
  }, []);

  const onHospitalSelect = async hospitalId => {
    try {
      setLoading(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error(t('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.'));
      }

      const response = await axios.get(`${MAP_API_URL}/${hospitalId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setMapUrls(response.data.map_urls);

      showMapSelectionAlert(response.data.map_urls);
    } catch (err) {
      setError(t('병원 정보를 불러오는 데 실패했습니다.'));
    } finally {
      setLoading(false);
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
          '선택하신 진료과에 맞는 병원을 추천해 드립니다\n이동 거리와 예상 소요 시간을 참고해주세요',
        )}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2527BF" />
      ) : hospitals.length === 0 ? (
        <Text style={styles.noHospitalsText}>
          {t('추천할 병원이 없습니다.')}
        </Text>
      ) : (
        <ScrollView style={styles.hospitalList}>
          {hospitals.map((hospital, index) => (
            <TouchableOpacity
              key={index}
              style={styles.hospitalCard}
              onPress={() => onHospitalSelect(hospital.id)}>
              <View style={styles.hospitalCardContent}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>

                <Text style={styles.hospitalLabel}>{t('전화 번호')}</Text>
                <Text style={styles.hospitalInfo}>
                  {hospital.telephone || t('정보 없음')}
                </Text>

                <Text style={styles.hospitalLabel}>{t('주소')}</Text>
                <Text style={styles.hospitalInfo}>
                  {hospital.address || t('정보 없음')}
                </Text>

                <Text style={styles.hospitalLabel}>{t('이동 거리')}</Text>
                <Text style={styles.hospitalInfo}>
                  {hospital.transit_travel_distance_km?.toFixed(1) || '-'} km
                </Text>

                <Text style={styles.hospitalLabel}>{t('예상 소요 시간')}</Text>
                <Text style={styles.hospitalInfo}>
                  {hospital.transit_travel_time_m || '-'} {t('분')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendHospitalListScreen;
