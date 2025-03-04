import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/ChooseDetailBodyStyles';

const ChooseDetailBodyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 선택한 주요 신체 부위 데이터
  const selectedDetails = route.params?.selectedDetails || [];

  useEffect(() => {
    console.log('📌 선택된 주요 신체 부위:', selectedDetails);
  }, [selectedDetails]);

  const [selectedConditions, setSelectedConditions] = useState({});

  const toggleCondition = (bodyPart, condition) => {
    setSelectedConditions(prev => {
      const currentConditions = prev[bodyPart] || [];
      const updatedConditions = currentConditions.includes(condition)
        ? currentConditions.filter(item => item !== condition)
        : [...currentConditions, condition];

      const newState = {...prev, [bodyPart]: updatedConditions};

      console.log(`🔹 ${bodyPart} 선택됨:`, updatedConditions);

      setTimeout(() => {
        console.log('📌 전체 선택된 세부 신체 부위:', newState);
      }, 100);

      return newState;
    });
  };

  useEffect(() => {
    console.log('📌 현재 선택된 세부 신체 부위:', selectedConditions);
  }, [selectedConditions]);

  const handleNext = () => {
    console.log('✅ 선택된 세부 신체 부위 데이터:', selectedConditions);

    const selectedBodyParts = Object.keys(selectedConditions).filter(
      key => selectedConditions[key].length > 0,
    );

    console.log('✅ 최종 전달할 신체 부위:', selectedBodyParts);

    if (selectedBodyParts.length === 0) {
      Alert.alert('선택 필요', '최소 1개 이상의 신체 부위를 선택하세요.');
      return;
    }

    const selectedDetailsWithDescription = selectedDetails.map(part => ({
      title: part.title || '',
      details: selectedConditions[part.title] || [],
    }));

    console.log('📌 최종 전달할 상세 데이터:', selectedDetailsWithDescription);

    navigation.navigate('ChooseDetailSymptom', {
      selectedBodyParts,
      selectedDetails: selectedDetailsWithDescription,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ✅ 세부 신체 부위 선택 */}
        {selectedDetails.length > 0 ? (
          selectedDetails.map((part, index) => (
            <View key={index} style={styles.bodyPartContainer}>
              <Text style={styles.partTitle}>{part.title || ''}</Text>
              <View style={styles.conditionsWrapper}>
                {Arrayㄱ.isArray(part.details) ? (
                  part.details.map(detail => (
                    <TouchableOpacity
                      key={String(detail)}
                      style={[
                        styles.conditionButton,
                        selectedConditions[part.title]?.includes(detail) &&
                          styles.conditionButtonSelected,
                      ]}
                      onPress={() => toggleCondition(part.title, detail)}>
                      <Text
                        style={[
                          styles.conditionText,
                          selectedConditions[part.title]?.includes(detail) &&
                            styles.conditionTextSelected,
                        ]}>
                        {String(detail)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noSelectionText}>
                    세부 항목이 없습니다.
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noSelectionText}>선택된 부위가 없습니다.</Text>
        )}
      </ScrollView>

      {/* ✅ 다음 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: '#2527BF',
            },
          ]}
          onPress={handleNext}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailBodyScreen;
