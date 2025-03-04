import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/ChooseMainBodyStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const FETCH_API_URL = 'http://52.78.79.53:8081/api/v1/main-body/all';
const SAVE_API_URL = 'http://52.78.79.53:8081/api/v1/selected-mbp';

const ChooseMainBodyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [mainBodyParts, setMainBodyParts] = useState<
    {body: string; description: string}[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 주요 신체 부위 리스트 가져오기
  useEffect(() => {
    const fetchMainBodyParts = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', '로그인이 필요합니다.');
          return;
        }

        const response = await fetch(FETCH_API_URL, {
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
        setMainBodyParts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainBodyParts();
  }, []);

  // ✅ 선택한 부위 토글 (최대 2개)
  const toggleSelection = (body: string) => {
    if (selectedParts.includes(body)) {
      setSelectedParts(selectedParts.filter(item => item !== body));
    } else {
      if (selectedParts.length >= 2) {
        Alert.alert('선택 제한', '최대 2개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedParts([...selectedParts, body]);
    }
  };

  // ✅ 선택한 부위 저장 API 호출 및 다음 화면으로 이동
  const handleConfirm = async () => {
    if (selectedParts.length === 0) {
      Alert.alert('선택 필요', '최소 1개 이상의 신체 부위를 선택하세요.');
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const requestBody = {
        body: selectedParts,
      };

      console.log('📤 서버에 전송할 데이터:', requestBody);

      const response = await fetch(SAVE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Accept: 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('✅ 서버 응답:', result);

      if (!response.ok) {
        throw new Error(result.message || `서버 오류: ${response.status}`);
      }

      Alert.alert('Success', '선택한 부위가 저장되었습니다.');

      // ✅ 선택한 부위를 객체 배열로 변환하여 전달
      const selectedDetails = selectedParts.map(bodyPart => {
        const part = mainBodyParts.find(p => p.body === bodyPart);
        return {
          title: part?.body || '',
          description: part?.description || '',
          details: [], // 상세 증상은 이후 추가될 예정
        };
      });

      console.log('📌 다음 화면으로 전달할 데이터:', selectedDetails);

      navigation.navigate('ChooseDetailBody', {selectedDetails});
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('Error', `저장 중 오류 발생: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2527BF" />
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류 발생: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {mainBodyParts.map((part, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bodyPartContainer}
            onPress={() => toggleSelection(part.body)}>
            <View style={styles.bodyPartRow}>
              <View>
                <Text style={styles.title}>{part.description}</Text>
              </View>
              {selectedParts.includes(part.body) && (
                <Image source={CheckIcon} style={styles.checkIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                selectedParts.length > 0 && !isSaving ? '#2527BF' : '#d1d1d1',
            },
          ]}
          onPress={handleConfirm}
          disabled={selectedParts.length === 0 || isSaving}>
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

export default ChooseMainBodyScreen;
