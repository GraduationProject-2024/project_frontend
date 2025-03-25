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
import {useTranslation} from 'react-i18next'; // ✅ i18n 추가
import styles from '../../styles/AIHistoryTaking/ChooseMainBodyStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const FETCH_API_URL = 'http://52.78.79.53:8081/api/v1/main-body/all';
const SAVE_API_URL = 'http://52.78.79.53:8081/api/v1/selected-mbp';
const SUB_BODY_API_URL = 'http://52.78.79.53:8081/api/v1/sub-body';

const ChooseMainBodyScreen: React.FC = () => {
  const {t} = useTranslation(); // ✅ 다국어 번역 적용
  const navigation = useNavigation();
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [mainBodyParts, setMainBodyParts] = useState<
    {body: string; description: string; mainBodyPartId: number}[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainBodyParts = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', t('로그인이 필요합니다.'));
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
          throw new Error(`${t('서버 오류')}: ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 주요 신체 부위 조회 응답:', data);
        setMainBodyParts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainBodyParts();
  }, []);

  const toggleSelection = (body: string) => {
    const matchedPart = mainBodyParts.find(p => p.body === body);
    if (!matchedPart) {
      return;
    }

    if (selectedParts.includes(matchedPart.description)) {
      setSelectedParts(
        selectedParts.filter(item => item !== matchedPart.description),
      );
    } else {
      if (selectedParts.length >= 2) {
        Alert.alert(t('선택 제한'), t('최대 2개까지만 선택할 수 있습니다.'));
        return;
      }
      setSelectedParts([...selectedParts, matchedPart.description]);
    }
    console.log('📌 현재 선택한 신체 부위:', selectedParts);
  };

  const handleConfirm = async () => {
    if (selectedParts.length === 0) {
      Alert.alert(t('선택 필요'), t('최소 1개 이상의 신체 부위를 선택하세요.'));
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', t('로그인이 필요합니다.'));
        return;
      }

      const requestBody = {
        description: selectedParts,
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
        throw new Error(
          result.message || `${t('서버 오류')}: ${response.status}`,
        );
      }

      if (!result.selectedMBPId) {
        throw new Error(t('서버 응답에 selectedMBPId가 없습니다.'));
      }

      navigation.navigate('ChooseDetailBody', {
        selectedMBPId: result.selectedMBPId,
      });
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('Error', `${t('저장 중 오류 발생')}: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.titleText}>
          {t(
            '먼저 통증을 느끼는 신체 부위를 선택해주세요\n신체 부위는 최대 두 군데를 선택할 수 있습니다',
          )}
        </Text>
        {mainBodyParts.map((part, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bodyPartContainer}
            onPress={() => toggleSelection(part.body)}>
            <View style={styles.bodyPartRow}>
              <View>
                <Text style={styles.title}>{part.description}</Text>
              </View>
              {selectedParts.includes(part.description) && (
                <Image source={CheckIcon} style={styles.checkIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{t('선택 완료')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseMainBodyScreen;
