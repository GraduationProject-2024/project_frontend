import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/MedicalInformation/IntegratedMedicalStyles';

const IntegratedMedicalScreen = ({navigation}) => {
  const {t} = useTranslation();
  const route = useRoute();
  const memberId = Number(route.params?.memberId);

  useEffect(() => {
    console.log('🔎 Received memberId:', memberId);
  }, [memberId]);

  if (!memberId) {
    Alert.alert(t('오류'), t('회원 ID가 존재하지 않습니다.'), [
      {text: t('확인'), onPress: () => navigation.goBack()},
    ]);
    return null;
  }

  const [pastMedicalHistory, setPastMedicalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);

  const isAnyFieldFilled =
    pastMedicalHistory.trim() ||
    familyHistory.trim() ||
    currentMedications.trim() ||
    allergies.trim();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestBody = {
        pastHistory: pastMedicalHistory.trim(),
        familyHistory: familyHistory.trim(),
        nowMedicine: currentMedications.trim(),
        allergy: allergies.trim(),
      };

      const apiUrl = `http://52.78.79.53:8081/api/v1/healthInfo?memberId=${memberId}`;
      console.log('📡 Sending request to:', apiUrl);
      console.log('📦 Request Body:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('✅ Response status:', response.status);
      const responseText = await response.text();
      console.log('📡 Server Response:', responseText);

      if (!response.ok) {
        let errorMessage = `${t('서버 오류')}: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('JSON 파싱 오류:', jsonError);
        }
        throw new Error(errorMessage);
      }

      Alert.alert(t('성공'), t('건강 정보가 저장되었습니다.'), [
        {text: t('확인'), onPress: () => navigation.navigate('Home')},
      ]);
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert(
        t('네트워크 오류'),
        error.message || t('건강 정보를 저장하는 동안 오류가 발생했습니다.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titleText}>
          {t(
            '보다 정확한 서비스 제공을 위해 가지고 있는 과거병력, 가족력, 현재 복용하는 약, 알레르기를 입력해주세요',
          )}
        </Text>

        <Text style={styles.label}>{t('과거병력')}</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder={t('과거병력 입력')}
            value={pastMedicalHistory}
            onChangeText={setPastMedicalHistory}
          />
        </View>

        <Text style={styles.label}>{t('가족력')}</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder={t('가족력 입력')}
            value={familyHistory}
            onChangeText={setFamilyHistory}
          />
        </View>

        <Text style={styles.label}>{t('현재 복용하는 약')}</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder={t('현재 복용하는 약 입력')}
            value={currentMedications}
            onChangeText={setCurrentMedications}
          />
        </View>

        <Text style={styles.label}>{t('알레르기')}</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder={t('알레르기 입력')}
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isAnyFieldFilled ? '#2527BF' : '#CCCCCC',
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading
              ? t('저장 중...')
              : isAnyFieldFilled
              ? t('등록 완료')
              : t('건너뛰기')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IntegratedMedicalScreen;
