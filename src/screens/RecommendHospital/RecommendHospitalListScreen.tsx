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
import styles from '../../styles/RecommendHospital/RecommendHospitalListStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/hospital';
const MAP_API_URL = 'http://52.78.79.53:8081/api/v1/hospital-map';

const RecommendHospitalListScreen = ({route, navigation}) => {
  const {selectedDepartment} = route.params;
  const {t} = useTranslation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrls, setMapUrls] = useState(null);

  const latitude = 37.546584;
  const longitude = 126.964649;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error(t('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.'));
        }

        const requestData = {
          lat: latitude,
          lon: longitude,
          is_report: false,
          report_id: '',
          department: selectedDepartment,
          suspected_disease: [''],
          secondary_hospital: true,
          tertiary_hospital: true,
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
  }, [selectedDepartment]);

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
        <ActivityIndicator
          size="large"
          color="#2527BF"
          style={styles.loadingIndicator}
        />
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
                {hospital.telephone && (
                  <Text style={styles.hospitalInfo}>
                    ☎️ {t('전화 번호')}: {hospital.telephone}
                  </Text>
                )}
                {hospital.address && (
                  <Text style={styles.hospitalInfo}>
                    🗺️ {t('주소')}: {hospital.address}
                  </Text>
                )}
                <Text style={styles.hospitalInfo}>
                  🚆 {t('이동 거리')}:{' '}
                  {hospital.transit_travel_distance_km?.toFixed(1) || '-'} km
                </Text>
                <Text style={styles.hospitalInfo}>
                  ⏳ {t('예상 소요 시간')}:{' '}
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
