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
import styles from '../../styles/MedicalInformation/MedicalInformationStyles';

const MedicalInformationScreen = ({navigation}) => {
  const route = useRoute();
  const memberId = route.params?.memberId
    ? parseInt(route.params.memberId, 10)
    : null;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('50');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // 사용자 기본 정보 API 요청
  const handleSubmit = async () => {
    if (
      !phoneNumber.trim() ||
      !gender ||
      !address.trim() ||
      !age ||
      !height ||
      !weight ||
      memberId === null ||
      isNaN(memberId)
    ) {
      Alert.alert('오류', '입력 정보를 확인해주세요.');
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        number: phoneNumber.toString(),
        address: address.trim(),
        gender: gender === '남성' ? 'MALE' : 'FEMALE',
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
      };

      console.log('📡 API 요청 시작...', requestBody);
      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/basicInfo?memberId=${memberId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log('✅ API 요청 완료, 응답 상태 코드:', response.status);
      const responseText = await response.text();
      console.log('📡 서버 응답 데이터:', responseText);

      if (!response.ok) {
        let errorMessage = `서버 오류: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('JSON 파싱 오류:', jsonError);
        }
        throw new Error(errorMessage);
      }

      Alert.alert('성공', '기본 정보가 저장되었습니다.');
      navigation.navigate('IntegratedMedical', {memberId});
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert(
        '네트워크 오류',
        error.message || '기본 정보를 저장하는 동안 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 성별 선택 */}
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

        {/* 나이 입력 */}
        <Text style={styles.label}>나이</Text>
        <View style={styles.ageContainer}>
          <TouchableOpacity
            style={styles.ageButton}
            onPress={() =>
              setAge(prev =>
                Number(prev) > 0 ? (Number(prev) - 1).toString() : '0',
              )
            }>
            <Text style={styles.ageButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.ageTextInput}
            value={age}
            onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={3}
          />
          <TouchableOpacity
            style={styles.ageButton}
            onPress={() => setAge(prev => (Number(prev) + 1).toString())}>
            <Text style={styles.ageButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 전화번호 입력 */}
        <Text style={styles.label}>전화번호</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="전화번호 입력"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
          />
        </View>

        {/* 주소 입력 */}
        <Text style={styles.label}>주소</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="주소 입력"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* 키 입력 */}
        <Text style={styles.label}>키</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="키 입력"
            keyboardType="numeric"
            value={height}
            onChangeText={text => setHeight(text.replace(/[^0-9]/g, ''))}
          />
          <Text style={styles.unitText}>cm</Text>
        </View>

        {/* 몸무게 입력 */}
        <Text style={styles.label}>몸무게</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={styles.unitInput}
            placeholder="몸무게 입력"
            keyboardType="numeric"
            value={weight}
            onChangeText={text => setWeight(text.replace(/[^0-9]/g, ''))}
          />
          <Text style={styles.unitText}>kg</Text>
        </View>
      </ScrollView>

      {/* "다음" 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                phoneNumber && gender && address && age && height && weight
                  ? '#2527BF'
                  : '#CCCCCC',
            },
          ]}
          disabled={
            !phoneNumber ||
            !gender ||
            !address ||
            !age ||
            !height ||
            !weight ||
            loading
          }
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? '저장 중...' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MedicalInformationScreen;
