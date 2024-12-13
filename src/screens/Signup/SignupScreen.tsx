import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import SignupStyles from '../../styles/Signup/SignupStyles';

import pwOpenIcon from '../../img/Signup/pwOpen.png';
import pwCloseIcon from '../../img/Signup/pwClose.png';

const SignupScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // 회원가입 API 요청 데이터
    const signupData = {
      loginId: email,
      password: password,
      email: email,
      name: name,
      nickname: nickname,
    };

    try {
      const response = await fetch(
        'http://192.168.48.1:8081/api/v1/member/sign-up',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login'); // 회원가입 성공 후 로그인 화면으로 이동
      } else {
        Alert.alert('Error', result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={SignupStyles.container}>
      {/* 이메일 입력 */}
      <Text style={SignupStyles.label}>이메일</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="이메일 입력"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* 이름 입력 */}
      <Text style={SignupStyles.label}>이름</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="이름 입력"
        value={name}
        onChangeText={setName}
      />

      {/* 닉네임 입력 */}
      <Text style={SignupStyles.label}>닉네임</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="닉네임 입력"
        value={nickname}
        onChangeText={setNickname}
      />

      {/* 비밀번호 입력 */}
      <Text style={SignupStyles.label}>비밀번호</Text>
      <View style={SignupStyles.passwordContainer}>
        <TextInput
          style={SignupStyles.passwordInput}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? pwOpenIcon : pwCloseIcon}
            style={SignupStyles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* 비밀번호 확인 입력 */}
      <Text style={SignupStyles.label}>비밀번호 확인</Text>
      <View style={SignupStyles.passwordContainer}>
        <TextInput
          style={SignupStyles.passwordInput}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={showConfirmPassword ? pwOpenIcon : pwCloseIcon}
            style={SignupStyles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* 회원 가입 버튼 */}
      <TouchableOpacity
        style={[
          SignupStyles.signupButton,
          {
            backgroundColor:
              email && name && nickname && password && confirmPassword
                ? '#2527BF'
                : '#d1d1d1',
          },
        ]}
        onPress={handleSignup}
        disabled={
          !email || !name || !nickname || !password || !confirmPassword
        }>
        <Text style={SignupStyles.signupButtonText}>회원 가입</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
