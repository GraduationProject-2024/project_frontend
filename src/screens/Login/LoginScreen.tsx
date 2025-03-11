import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginStyles from '../../styles/Login/LoginStyles';

import MedikoImage from '../../img/Login/MEDIKO.png';
import MedikoLogo from '../../img/Login/MedikoLogo.png';
import GoogleLoginLogo from '../../img/Login/GoogleLoginLogo.png';
import KakaoLoginLogo from '../../img/Login/KakaoLoginLogo.png';
import NaverLoginLogo from '../../img/Login/NaverLoginLogo.png';

const API_URL = 'http://52.78.79.53:8081/api/v1/member/sign-in';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      console.log('🔹 로그인 요청 시작...', API_URL);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Accept: 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          loginId: username,
          password: password,
        }),
      });

      console.log('🔹 응답 상태 코드:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error(`서버 응답이 JSON이 아닙니다: ${errorText}`);
      }

      const result = await response.json();
      console.log('🔹 서버 응답:', result);

      if (response.ok) {
        await AsyncStorage.setItem('accessToken', result.accessToken);
        await AsyncStorage.setItem('refreshToken', result.refreshToken);

        Alert.alert('Success', '로그인 성공!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', result.message || '로그인 실패');
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
      Alert.alert('Error', `네트워크 오류: ${error.message}`);
    }
  };

  const handleSNSLogin = (platform: string) => {
    Alert.alert(`${platform} 로그인`, `${platform} 로그인 기능 준비 중입니다.`);
  };

  return (
    <View style={LoginStyles.container}>
      {/* 로고 및 메인 이미지 */}
      <View style={LoginStyles.logoContainer}>
        <Image source={MedikoLogo} style={LoginStyles.logoImage} />
        <Image source={MedikoImage} style={LoginStyles.medikoImage} />
      </View>

      {/* 입력 필드 */}
      <TextInput
        style={LoginStyles.input}
        placeholder="아이디 입력"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={LoginStyles.input}
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
        <Text style={LoginStyles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 링크 */}
      <View style={LoginStyles.linkContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MedicalInformation')}>
          <Text style={LoginStyles.link}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={LoginStyles.separator}> | </Text>
        <TouchableOpacity>
          <Text style={LoginStyles.link}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={LoginStyles.separator}> | </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={LoginStyles.link}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* SNS 계정 로그인 */}
      <View style={LoginStyles.snsTextContainer}>
        <View style={LoginStyles.horizontalLine} />
        <Text style={LoginStyles.snsText}>SNS 계정으로 로그인</Text>
        <View style={LoginStyles.horizontalLine} />
      </View>
      <View style={LoginStyles.snsContainer}>
        <TouchableOpacity
          style={LoginStyles.snsItem}
          onPress={() => handleSNSLogin('Google')}>
          <Image source={GoogleLoginLogo} style={LoginStyles.snsLogo} />
          <Text style={LoginStyles.snsLabel}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={LoginStyles.snsItem}
          onPress={() => handleSNSLogin('Kakao')}>
          <Image source={KakaoLoginLogo} style={LoginStyles.snsLogo} />
          <Text style={LoginStyles.snsLabel}>Kakao</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={LoginStyles.snsItem}
          onPress={() => handleSNSLogin('Naver')}>
          <Image source={NaverLoginLogo} style={LoginStyles.snsLogo} />
          <Text style={LoginStyles.snsLabel}>Naver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
