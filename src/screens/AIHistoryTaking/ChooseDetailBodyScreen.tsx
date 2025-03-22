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

const SUB_BODY_API_URL = 'http://52.78.79.53:8081/api/v1/sub-body';
const SELECTED_MBP_API_URL = 'http://52.78.79.53:8081/api/v1/selected-mbp';
const SELECTED_SBP_API_URL = 'http://52.78.79.53:8081/api/v1/selected-sbp';

const ChooseDetailBodyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedMBPId = route.params?.selectedMBPId;

  const [subBodyParts, setSubBodyParts] = useState<
    {body: string; description: string; mainBodyPartId: number}[]
  >([]);
  const [selectedSubParts, setSelectedSubParts] = useState<string[]>([]);
  const [selectedSBPId, setSelectedSBPId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    console.log('📌 선택된 주요 신체 부위 ID:', selectedMBPId);

    const fetchSelectedMainBody = async () => {
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

        console.log('🛠 요청 헤더:', {
          Accept: 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        });

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ 서버 응답 (선택한 주요 신체 부위):', data);

        if (!data.description || !Array.isArray(data.description)) {
          throw new Error('서버에서 올바른 데이터를 반환하지 않았습니다.');
        }

        fetchSubBodyParts(data.description);
      } catch (err) {
        console.error('❌ 주요 신체 부위 조회 오류:', err);
        setError(err.message);
      }
    };

    if (selectedMBPId) {
      fetchSelectedMainBody();
    }
  }, [selectedMBPId]);

  const fetchSubBodyParts = async (bodies: string[]) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const query = bodies
        .map(body => `body=${encodeURIComponent(body)}`)
        .join('&');
      const requestUrl = `${SUB_BODY_API_URL}?${query}`;
      console.log('📤 세부 신체 부위 조회 요청:', requestUrl);

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
      console.log('✅ 서버 응답 (세부 신체 부위):', data);
      setSubBodyParts(data);
    } catch (err) {
      console.error('❌ 세부 신체 부위 조회 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubPartSelection = (description: string) => {
    setSelectedSubParts(prev =>
      prev.includes(description)
        ? prev.filter(item => item !== description)
        : [...prev, description],
    );
  };

  const saveSelectedSubBodyParts = async () => {
    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const requestUrl = `${SELECTED_SBP_API_URL}/${selectedMBPId}`;
      const requestBody = {description: selectedSubParts};
      console.log('📤 서버에 전송할 데이터:', JSON.stringify(requestBody));

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Accept: 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🛠 요청 URL:', requestUrl);
      console.log('🛠 요청 메서드: POST');
      console.log('🛠 요청 헤더:', {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      });

      const result = await response.json();
      console.log('✅ 서버 응답:', result);

      if (!response.ok) {
        throw new Error(result.message || `서버 오류: ${response.status}`);
      }

      if (!result.selectedSBPId) {
        throw new Error('서버 응답에 selectedSBPId가 없습니다.');
      }

      setSelectedSBPId(result.selectedSBPId);
      Alert.alert('Success', '선택한 세부 신체 부위가 저장되었습니다.');

      navigation.navigate('ChooseDetailSymptom', {
        selectedDetails: selectedSubParts,
        selectedSBPId: result.selectedSBPId,
      });
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('Error', `저장 중 오류 발생: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2527BF" />
        ) : error ? (
          <Text style={styles.errorText}>❌ 오류 발생: {error}</Text>
        ) : (
          <View style={styles.toggleContainer}>
            {subBodyParts.map((part, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.toggleButton,
                  selectedSubParts.includes(part.description) &&
                    styles.selectedToggleButton,
                ]}
                onPress={() => toggleSubPartSelection(part.description)}>
                <Text
                  style={[
                    styles.toggleText,
                    selectedSubParts.includes(part.description) &&
                      styles.selectedToggleText,
                  ]}>
                  {part.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {backgroundColor: isSaving ? '#d1d1d1' : '#2527BF'},
          ]}
          onPress={saveSelectedSubBodyParts}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>선택 완료</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailBodyScreen;
