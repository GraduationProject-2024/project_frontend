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

const ChooseDetailSymptomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedDetails = route.params?.selectedDetails || [];

  const [detailedSigns, setDetailedSigns] = useState<{
    [key: string]: {sign: string; description: string}[];
  }>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📌 선택된 세부 신체 부위:', selectedDetails);
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

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(item => item !== symptom)
        : [...prev, symptom],
    );
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
                {signs.map(({sign, description}, symptomIndex) => (
                  <TouchableOpacity
                    key={symptomIndex}
                    style={[
                      styles.symptomButton,
                      selectedSymptoms.includes(sign) &&
                        styles.symptomButtonSelected,
                    ]}
                    onPress={() => toggleSymptom(sign)}>
                    <Text
                      style={[
                        styles.symptomText,
                        selectedSymptoms.includes(sign) &&
                          styles.symptomTextSelected,
                      ]}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                selectedSymptoms.length > 0 ? '#2527BF' : '#d1d1d1',
            },
          ]}
          onPress={() =>
            navigation.navigate('SymptomOnsetTime', {selectedSymptoms})
          }
          disabled={selectedSymptoms.length === 0}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailSymptomScreen;
