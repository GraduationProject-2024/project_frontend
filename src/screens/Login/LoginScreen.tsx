import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import LoginStyles from '../../styles/Login/LoginStyles';

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

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.logoContainer}>
        <View style={LoginStyles.logoPlaceholder} />
        <Text style={LoginStyles.logoText}>MEDIKO</Text>
      </View>

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

      <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin}>
        <Text style={LoginStyles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={LoginStyles.linkContainer}>
        <Text style={LoginStyles.link}>아이디 찾기</Text>
        <Text style={LoginStyles.separator}> | </Text>
        <Text style={LoginStyles.link}>비밀번호 찾기</Text>
        <Text style={LoginStyles.separator}> | </Text>
        <Text style={LoginStyles.link}>회원가입</Text>
      </View>

      <Text style={LoginStyles.snsText}>SNS 계정으로 로그인</Text>

      <View style={LoginStyles.snsContainer}>
        <View style={LoginStyles.snsButton}>
          <Text style={LoginStyles.snsButtonText}>Google</Text>
        </View>
        <View style={LoginStyles.snsButton}>
          <Text style={LoginStyles.snsButtonText}>Kakao</Text>
        </View>
        <View style={LoginStyles.snsButton}>
          <Text style={LoginStyles.snsButtonText}>Naver</Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
