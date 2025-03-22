import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/ChooseDetailBodyStyles';

const SELECTED_MBP_API_URL = 'http://52.78.79.53:8081/api/v1/selected-mbp';

const ChooseDetailBodyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedMBPId = route.params?.selectedMBPId;

  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 선택한 주요 신체 부위 조회 API 연동
  useEffect(() => {
    const fetchSelectedMainBody = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', '로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        if (!selectedMBPId) {
          console.error('❌ selectedMBPId가 없습니다.');
          setLoading(false);
          return;
        }

        const requestUrl = `${SELECTED_MBP_API_URL}/${selectedMBPId}`;
        console.log('📤 선택한 주요 신체 부위 조회 요청:', requestUrl);

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json;charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ 서버 응답 (선택한 주요 신체 부위):', data);

        if (
          !data.description ||
          !Array.isArray(data.description) ||
          data.description.length === 0
        ) {
          throw new Error('서버에서 올바른 데이터를 반환하지 않았습니다.');
        }

        setSelectedDetails(data.description);
      } catch (err) {
        console.error('❌ 주요 신체 부위 조회 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedMBPId) {
      fetchSelectedMainBody();
    } else {
      console.error('❌ selectedMBPId가 전달되지 않음.');
      setLoading(false);
    }
  }, [selectedMBPId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2527BF" />
        ) : error ? (
          <Text style={styles.errorText}>❌ 오류 발생: {error}</Text>
        ) : (
          <>
            {selectedDetails.map((detail, index) => (
              <View key={index} style={styles.groupContainer}>
                <Text style={styles.groupTitle}>{detail}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, {backgroundColor: '#2527BF'}]}
          onPress={() => navigation.navigate('ChooseDetailSymptom')}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailBodyScreen;
