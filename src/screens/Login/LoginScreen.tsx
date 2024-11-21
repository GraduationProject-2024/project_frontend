import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Text,
} from 'react-native';
import LoginStyles from '../../styles/Login/LoginStyles';

// 이미지 import
import MedikoImage from '../../img/LoginScreen/MEDIKO.png';
import MedikoLogo from '../../img/LoginScreen/MedikoLogo.png';
import GoogleLoginLogo from '../../img/LoginScreen/GoogleLoginLogo.png';
import KakaoLoginLogo from '../../img/LoginScreen/KakaoLoginLogo.png';
import NaverLoginLogo from '../../img/LoginScreen/NaverLoginLogo.png';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      Alert.alert('Success', 'You are logged in!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Invalid username or password');
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
        onChangeText={setUsername}
      />
      <TextInput
        style={LoginStyles.input}
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
        <Text style={LoginStyles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 링크 */}
      <View style={LoginStyles.linkContainer}>
        <TouchableOpacity>
          <Text style={LoginStyles.link}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={LoginStyles.separator}> | </Text>
        <TouchableOpacity>
          <Text style={LoginStyles.link}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={LoginStyles.separator}> | </Text>
        <TouchableOpacity>
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
