import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/ChooseDetailSymptomStyles';
import symptomData from '../../data/symptomData.json';

const ChooseDetailSymptomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const selectedDetails = route.params?.selectedDetails || [];

  useEffect(() => {
    console.log('📌 선택된 세부 신체 부위:', selectedDetails);
  }, [selectedDetails]);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const toggleSymptom = symptom => {
    setSelectedSymptoms(prev => {
      return prev.includes(symptom)
        ? prev.filter(item => item !== symptom)
        : [...prev, symptom];
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedDetails.length > 0 ? (
          selectedDetails.map((part, index) => (
            <View key={index} style={styles.bodyPartContainer}>
              {Array.isArray(part.details) && part.details.length > 0 ? (
                part.details.map((detail, detailIndex) => (
                  <View key={`${detail}-${detailIndex}`}>
                    <Text style={styles.partTitle}>{detail}</Text>
                    <View style={styles.symptomsWrapper}>
                      {(symptomData[detail] || []).map(
                        (symptom, symptomIndex) => (
                          <TouchableOpacity
                            key={`${detail}-${symptomIndex}`}
                            style={[
                              styles.symptomButton,
                              selectedSymptoms.includes(symptom) &&
                                styles.symptomButtonSelected,
                            ]}
                            onPress={() => toggleSymptom(symptom)}>
                            <Text
                              style={[
                                styles.symptomText,
                                selectedSymptoms.includes(symptom) &&
                                  styles.symptomTextSelected,
                              ]}>
                              {symptom}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noSelectionText}>
                  해당 신체 부위의 증상이 없습니다.
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noSelectionText}>
            선택된 신체 부위가 없습니다.
          </Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                selectedSymptoms.length > 0 ? '#2527BF' : '#d1d1d1',
            },
          ]}
          onPress={() =>
            navigation.navigate('SymptomOnsetTime', {selectedSymptoms})
          }
          disabled={selectedSymptoms.length === 0}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailSymptomScreen;
