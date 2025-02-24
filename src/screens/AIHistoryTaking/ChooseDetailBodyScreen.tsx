import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/ChooseDetailBodyStyles';

const ChooseDetailBodyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 안전한 데이터 접근을 위해 기본값 설정
  const selectedDetails = route.params?.selectedDetails || [];

  useEffect(() => {
    console.log('받은 데이터:', selectedDetails);
  }, [selectedDetails]);

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(item => item !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const handleNext = () => {
    console.log('선택된 항목:', selectedConditions);
    navigation.navigate('MedicineInformation');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedDetails.length > 0 ? (
          selectedDetails.map((part, index) => (
            <View key={index} style={styles.bodyPartContainer}>
              {/* 신체 부위 이름 */}
              <Text style={styles.partTitle}>{part.title}</Text>
              <View style={styles.conditionsWrapper}>
                {part.details.map(detail => (
                  <TouchableOpacity
                    key={detail}
                    style={[
                      styles.conditionButton,
                      selectedConditions.includes(detail) &&
                        styles.conditionButtonSelected,
                    ]}
                    onPress={() => toggleCondition(detail)}>
                    <Text
                      style={[
                        styles.conditionText,
                        selectedConditions.includes(detail) &&
                          styles.conditionTextSelected,
                      ]}>
                      {detail}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noSelectionText}>선택된 부위가 없습니다.</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                selectedConditions.length > 0 ? '#2527BF' : '#d1d1d1',
            },
          ]}
          onPress={handleNext}
          disabled={selectedConditions.length === 0}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailBodyScreen;
