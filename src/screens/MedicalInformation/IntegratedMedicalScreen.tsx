import React, {useState} from 'react';
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
import styles from '../../styles/MedicalInformation/IntegratedMedicalStyles';

const IntegratedMedicalScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pastMedicalHistory, setPastMedicalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (
      !phoneNumber.trim() ||
      !pastMedicalHistory.trim() ||
      !familyHistory.trim() ||
      !currentMedications.trim() ||
      !allergies.trim()
    ) {
      Alert.alert('오류', '입력 정보를 확인해주세요.');
      return;
    }

    Alert.alert('성공', '정보가 저장되었습니다.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titleText}>
          보다 정확한 서비스 제공을 위해 가지고 있는 과거병력, {'\n'}
          가족력, 현재 복용하는 약, 알레르기를 입력해주세요
        </Text>
        <Text style={styles.label}>과거병력</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="과거병력 입력"
            value={pastMedicalHistory}
            onChangeText={setPastMedicalHistory}
          />
        </View>

        <Text style={styles.label}>가족력</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="가족력 입력"
            value={familyHistory}
            onChangeText={setFamilyHistory}
          />
        </View>

        <Text style={styles.label}>현재 복용하는 약</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="현재 복용하는 약 입력"
            value={currentMedications}
            onChangeText={setCurrentMedications}
          />
        </View>

        <Text style={styles.label}>알레르기</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="알레르기 입력"
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
              backgroundColor:
                phoneNumber &&
                pastMedicalHistory &&
                familyHistory &&
                currentMedications &&
                allergies
                  ? '#2527BF'
                  : '#CCCCCC',
            },
          ]}
          disabled={
            !phoneNumber ||
            !pastMedicalHistory ||
            !familyHistory ||
            !currentMedications ||
            !allergies ||
            loading
          }
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? '저장 중...' : '건강 정보 등록'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IntegratedMedicalScreen;
