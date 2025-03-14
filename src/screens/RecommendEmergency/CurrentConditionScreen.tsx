import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/MedicalInformation/MedicineInformationStyles';

const MedicineInformationScreen = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const navigation = useNavigation();

  const medicalConditions = ['조산산모', '정신질환자', '신생아', '중증화상'];

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(item => item !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const handleNext = () => {
    console.log('선택된 복용하는 약:', selectedConditions);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        예상하는 현재의 응급 상태를 선택해주세요.
      </Text>
      <Text style={styles.title}>해당하는 상태가 없다면 건너뛰십시오.</Text>
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
