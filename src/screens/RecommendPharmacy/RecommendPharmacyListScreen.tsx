import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import RecommendPharmacyListStyles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // 📌 1️⃣ 위치 권한 요청 함수 (Android + iOS)
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
        console.error('위치 권한 요청 오류:', error);
        Alert.alert('위치 권한 요청에 실패했습니다.');
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
        console.log('✅ 위치 가져오기 성공:', position);
        const {latitude, longitude} = position.coords;

        setLocation({latitude, longitude});
        fetchPharmacies(latitude, longitude);
      },
      error => {
        console.error('❌ 위치 정보를 가져오는 데 실패했습니다:', error);

        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = '위치 권한이 거부되었습니다.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case 3: // TIMEOUT
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.';
            break;
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.';
        }

        Alert.alert(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // 더 정확한 위치 사용
        timeout: 15000, // 15초 내에 응답 없으면 실패 처리
        maximumAge: 0, // 캐시된 위치 데이터를 사용하지 않음
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

  // 📌 4️⃣ 약국 추천 API 호출 (토큰 포함)
  const fetchPharmacies = async (lat, lon) => {
    console.log('📡 API 요청 전송:', lat, lon);

    const token = await getAccessToken();
    if (!token) {
      return;
    } // 토큰이 없으면 API 요청 중단

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
      console.log('📩 API 응답:', data);

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
      {/* 📌 5️⃣ 로딩 상태 */}
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
                  {pharmacy.name}
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
                  {pharmacy.time} | {pharmacy.distance}
                </Text>
                <Text style={RecommendPharmacyListStyles.pharmacyAddress}>
                  {pharmacy.address}
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
