import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/ChooseDetailSymptomStyles';

const DETAILED_SIGN_API_URL = 'http://52.78.79.53:8081/api/v1/detailed-sign';
const SAVE_SIGN_API_URL = 'http://52.78.79.53:8081/api/v1/selected-sign';

const ChooseDetailSymptomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 이전 화면에서 전달받은 데이터
  const selectedDetails = route.params?.selectedDetails || [];
  const selectedSBPId = route.params?.selectedSBPId; // 단일 ID로 처리

  const [detailedSigns, setDetailedSigns] = useState<{
    [key: string]: {sign: string; description: string}[];
  }>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    console.log('📌 선택된 세부 신체 부위:', selectedDetails);
    console.log('🔍 선택된 SBP ID:', selectedSBPId);

    if (!selectedSBPId) {
      Alert.alert('Error', '선택된 세부 신체 부위 ID가 없습니다.');
      console.error('🚨 selectedSBPId가 undefined입니다:', selectedSBPId);
      setLoading(false);
      return;
    }

    if (selectedDetails.length > 0) {
      fetchDetailedSigns(selectedDetails);
    } else {
      console.warn('🚨 선택된 세부 신체 부위가 없습니다!');
      setLoading(false);
    }
  }, [selectedDetails]);

  const fetchDetailedSigns = async (details: string[]) => {
    if (details.length === 0) {
      console.warn('🚨 선택된 세부 신체 부위가 없습니다. 요청을 건너뜁니다.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const allSigns: {[key: string]: {sign: string; description: string}[]} =
        {};

      for (const detail of details) {
        const requestUrl = `${DETAILED_SIGN_API_URL}?body=${encodeURIComponent(
          detail,
        )}`;
        console.log('📤 상세 증상 조회 요청:', requestUrl);

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
        console.log(`✅ 서버 응답 (${detail}):`, data);

        allSigns[detail] = data;
      }

      setDetailedSigns(allSigns);
    } catch (err) {
      console.error('❌ 상세 증상 조회 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom: {sign: string; description: string}) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom.description)
        ? prev.filter(item => item !== symptom.description)
        : [...prev, symptom.description],
    );
  };

  const saveSelectedSymptoms = async () => {
    if (!selectedSBPId) {
      Alert.alert('Error', '선택된 세부 신체 부위 ID가 없습니다.');
      console.error('🚨 selectedSBPId가 undefined:', selectedSBPId);
      return;
    }

    if (selectedSymptoms.length === 0) {
      Alert.alert('Error', '선택된 증상이 없습니다.');
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      // ✅ `selectedSymptoms`에서 `description` 값만 전송 (한글 값)
      const selectedDescriptions = selectedSymptoms;

      if (selectedDescriptions.length === 0) {
        Alert.alert('Error', '선택한 증상 중 서버에서 허용하는 값이 없습니다.');
        console.error(
          '🚨 유효한 증상이 없음. 필터링된 데이터:',
          selectedDescriptions,
        );
        return;
      }

      // ✅ 여러 개의 증상에 대해 개별 요청 보내기
      for (const symptom of selectedDescriptions) {
        const requestBody = {description: [symptom]};
        const requestUrl = `${SAVE_SIGN_API_URL}/${selectedSBPId}`;

        console.log('📤 선택한 증상 저장 요청:', requestUrl);
        console.log('📤 요청 데이터:', JSON.stringify(requestBody, null, 2));

        try {
          const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              Accept: 'application/json;charset=UTF-8',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          });

          const statusCode = response.status;
          console.log(
            `🔍 HTTP 응답 상태 코드 (SBP ID ${selectedSBPId}): ${statusCode}`,
          );

          if (!response.ok) {
            const errorResponse = await response.json();
            console.error(
              `❌ 서버 오류 (SBP ID ${selectedSBPId}):`,
              errorResponse,
            );
            throw new Error(
              `서버 오류: ${statusCode} - ${JSON.stringify(errorResponse)}`,
            );
          }

          const result = await response.json();
          console.log(
            `✅ 서버 응답 (선택한 증상 저장 - SBP ID ${selectedSBPId}):`,
            result,
          );
        } catch (networkError) {
          console.error(
            `❌ 네트워크 오류 (SBP ID ${selectedSBPId}):`,
            networkError,
          );
          Alert.alert('Error', `네트워크 오류 발생: ${networkError.message}`);
        }
      }

      Alert.alert('Success', '선택한 증상이 저장되었습니다.');
      navigation.navigate('SymptomOnsetTime');
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
          Object.entries(detailedSigns).map(([description, signs], index) => (
            <View key={index} style={styles.bodyPartContainer}>
              <Text style={styles.partTitle}>{description}</Text>
              <View style={styles.symptomsWrapper}>
                {signs.map((symptom, symptomIndex) => (
                  <TouchableOpacity
                    key={symptomIndex}
                    style={[
                      styles.symptomButton,
                      selectedSymptoms.includes(symptom.description) &&
                        styles.symptomButtonSelected,
                    ]}
                    onPress={() => toggleSymptom(symptom)}>
                    <Text
                      style={[
                        styles.symptomText,
                        selectedSymptoms.includes(symptom.description) &&
                          styles.symptomTextSelected,
                      ]}>
                      {symptom.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={saveSelectedSymptoms}
        disabled={isSaving}>
        <Text style={styles.confirmButtonText}>선택 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseDetailSymptomScreen;
