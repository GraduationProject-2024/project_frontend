import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/MedicalInformation/FamilyMedicalHistoryStyles';

const FamilyMedicalHistoryScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const navigation = useNavigation();

  const medicalConditions = [
    '당뇨',
    '고혈압',
    '간질병증',
    '결핵',
    '위암',
    '대장암',
    '가족샘종폴립종',
  ];

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(item => item !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const handleNext = () => {
    console.log('선택된 가족력:', selectedConditions);
    navigation.navigate('MedicineInformation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>가족력을 모두 선택해주세요</Text>
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

export default FamilyMedicalHistoryScreen;
