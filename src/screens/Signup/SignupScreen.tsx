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

const SignupScreen = ({navigation}) => {
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

    const signupData = {
      loginId: email,
      password: password,
      email: email,
      name: name,
      nickname: nickname,
    };

    try {
      const response = await fetch(
        'http://52.78.79.53:8081/api/v1/member/sign-up',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        },
      );

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (response.ok) {
        const memberId = result.memberId;
        if (!memberId) {
          throw new Error('회원가입 성공했지만 memberId를 받지 못했습니다.');
        }

        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('ChooseLanguage', {memberId});
      } else {
        Alert.alert('Error', result.msg || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={SignupStyles.container}>
      <Text style={SignupStyles.label}>이메일</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="이메일 입력"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={SignupStyles.label}>이름</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="이름 입력"
        value={name}
        onChangeText={setName}
      />

      <Text style={SignupStyles.label}>닉네임</Text>
      <TextInput
        style={SignupStyles.input}
        placeholder="닉네임 입력"
        value={nickname}
        onChangeText={setNickname}
      />

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
