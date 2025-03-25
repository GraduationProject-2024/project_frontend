import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/RecommendEmergency/CurrentConditionStyles';

const CurrentConditionScreen = () => {
  const {t, i18n} = useTranslation();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    const languageChangedHandler = () => {
      setForceUpdate(prev => prev + 1);
    };

    i18n.on('languageChanged', languageChangedHandler);

    return () => {
      i18n.off('languageChanged', languageChangedHandler);
    };
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return token || null;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  const fetchMedicalConditions = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const response = await fetch('http://52.78.79.53:8081/api/v1/condition', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMedicalConditions(data);
    } catch (error) {
      console.error('Error fetching medical conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalConditions();
  }, []);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(item => item !== condition)
        : [...prev, condition],
    );
  };

  const handleNext = () => {
    console.log(t('선택된 복용하는 약:'), selectedConditions);
    navigation.navigate('RecommendEmergencyList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('예상하는 현재의 응급 상태를 선택해주세요.')}
        {'\n'}
        {t('해당하는 상태가 없다면 건너뛰십시오.')}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {medicalConditions.map(condition => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.conditionButton,
                selectedConditions.includes(condition) &&
                  styles.conditionButtonSelected,
              ]}
              onPress={() => toggleCondition(condition)}>
              <Text
                style={[
                  styles.conditionText,
                  selectedConditions.includes(condition) &&
                    styles.conditionTextSelected,
                ]}>
                {t(condition)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedConditions.length > 0
            ? styles.actionButtonActive
            : styles.actionButtonDisabled,
        ]}
        onPress={handleNext}>
        <Text style={styles.actionButtonText}>
          {selectedConditions.length > 0 ? t('선택 완료') : t('건너뛰기')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CurrentConditionScreen;
