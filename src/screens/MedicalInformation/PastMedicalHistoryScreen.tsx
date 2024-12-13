import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/MedicalInformation/PastMedicalHistoryStyles';

const PastMedicalHistoryScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const navigation = useNavigation();

  const medicalConditions = [
    '당뇨',
    '고혈압',
    '간질병증',
    '결핵',
    '복부수술력',
    '허리 척추 수술력',
    '최근 백신 접종력',
    '편도 절제 수술력',
    '최근 소화기 치료 내시경 시술력',
    '담석증',
    '충수절제수술력',
    '대장용종',
    '염증성장질환',
    '위암',
    '대장암',
    '만성바이러스성간염',
    '간암',
    '요로결석',
    '복부절개수술력',
    '식도수술력',
    '역류성 식도염',
    'B형 간염 만성 보균자',
    '위절제술',
    '대장절제술',
    '담낭절제술',
  ];

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(item => item !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const handleNext = () => {
    console.log('선택된 병력:', selectedConditions);
    navigation.navigate('FamilyMedicalHistory');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>과거 병력을 모두 선택해주세요</Text>
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
              {condition || ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedConditions.length > 0
            ? styles.actionButtonActive
            : styles.actionButtonDisabled,
        ]}
        onPress={handleNext}>
        <Text style={styles.actionButtonText}>
          {selectedConditions.length > 0 ? '다음' : '건너뛰기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PastMedicalHistoryScreen;
