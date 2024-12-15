import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../../styles/MedicalInformation/MedicalInformationStyles';

const MedicalInformationScreen = ({navigation}) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('20');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const isFormValid = gender && age && height && weight;

  const increaseAge = () => setAge(prevAge => (Number(prevAge) + 1).toString());
  const decreaseAge = () =>
    setAge(prevAge =>
      (Number(prevAge) > 0 ? Number(prevAge) - 1 : 0).toString(),
    );

  return (
    <View style={styles.container}>
      {/* Gender Selection */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === '여성' && styles.selectedGenderButton,
          ]}
          onPress={() => setGender('여성')}>
          <Text
            style={[
              styles.genderButtonText,
              gender === '여성' && styles.selectedGenderButtonText,
            ]}>
            여성
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === '남성' && styles.selectedGenderButton,
          ]}
          onPress={() => setGender('남성')}>
          <Text
            style={[
              styles.genderButtonText,
              gender === '남성' && styles.selectedGenderButtonText,
            ]}>
            남성
          </Text>
        </TouchableOpacity>
      </View>

      {/* Age Input */}
      <Text style={styles.label}>나이</Text>
      <View style={styles.ageContainer}>
        <TouchableOpacity style={styles.ageButton} onPress={decreaseAge}>
          <Text style={styles.ageButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.ageTextInput}
          value={age}
          onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={3} // Limit age input to 3 digits
        />
        <TouchableOpacity style={styles.ageButton} onPress={increaseAge}>
          <Text style={styles.ageButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Height Input */}
      <Text style={styles.label}>키</Text>
      <View style={styles.unitInputContainer}>
        <TextInput
          style={styles.unitInput}
          placeholder="키 입력"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <Text style={styles.unitText}>cm</Text>
      </View>

      {/* Weight Input */}
      <Text style={styles.label}>몸무게</Text>
      <View style={styles.unitInputContainer}>
        <TextInput
          style={styles.unitInput}
          placeholder="몸무게 입력"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={styles.unitText}>kg</Text>
      </View>

      {/* Next Button */}
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
