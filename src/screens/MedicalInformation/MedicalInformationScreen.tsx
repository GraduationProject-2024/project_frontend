import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../../styles/MedicalInformation/MedicalInformationStyles';

const MedicalInformationScreen = ({navigation}) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const isFormValid = gender && age && height && weight;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>성별</Text>
      <TextInput
        style={styles.input}
        placeholder="성별 선택"
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.label}>나이</Text>
      <TextInput
        style={styles.input}
        placeholder="나이 입력"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>키</Text>
      <TextInput
        style={styles.input}
        placeholder="키 입력"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>몸무게</Text>
      <TextInput
        style={styles.input}
        placeholder="몸무게 입력"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isFormValid ? '#2527BF' : '#CCCCCC'},
        ]}
        disabled={!isFormValid}
        onPress={() => navigation.navigate('PastMedicalHistory')}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicalInformationScreen;
