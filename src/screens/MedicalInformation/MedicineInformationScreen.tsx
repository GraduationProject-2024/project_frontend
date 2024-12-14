import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/MedicalInformation/MedicineInformationStyles';

const MedicineInformationScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const navigation = useNavigation();

  const medicalConditions = [
    '혈압약',
    '심장질환약',
    '간견병증',
    '당뇨약(혈당강하제)',
    '항생제',
    '비스테로이드성 진통 소염제',
    '경구 스테로이드',
    '음주',
    '한약',
    '최근 한약제 복용',
    '항암제',
  ];

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(item => item !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const handleNext = () => {
    console.log('선택된 복용하는 약:', selectedConditions);
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>복용하는 약을 모두 선택해주세요</Text>
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

export default MedicineInformationScreen;
