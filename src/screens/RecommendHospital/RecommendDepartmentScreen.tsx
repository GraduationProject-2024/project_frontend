import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../styles/RecommendHospital/RecommendDepartmentStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/department';

const RecommendDepartmentScreen = () => {
  const navigation = useNavigation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(LOGIN_URL, {
        username: 'noonsong',
        password: 'noonsong',
      });

      const accessToken = response.data?.access_token;
      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
        return accessToken;
      } else {
        throw new Error('액세스 토큰을 가져오지 못했습니다.');
      }
    } catch (err) {
      console.error('로그인 실패:', err);
      setError(`로그인에 실패했습니다: ${err.message}`);
      return null;
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      let accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        accessToken = await fetchAccessToken();
        if (!accessToken) {
          throw new Error('토큰이 없어 데이터를 불러올 수 없습니다.');
        }
      }

      const response = await axios.get(API_URL, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDepartments(response.data);
    } catch (err) {
      console.error('API 요청 실패:', err.response?.status, err.response?.data);
      setError(
        `데이터를 불러오는 데 실패했습니다: ${err.response?.status} - ${
          err.response?.data?.message || err.message
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handlePress = () => {
    navigation.navigate('RecommendHospitalList');
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      />
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {departments.map((department, index) => (
        <TouchableOpacity
          key={index}
          style={styles.departmentContainer}
          onPress={handlePress}>
          <Text style={styles.title}>{department.title}</Text>
          <Text style={styles.description}>{department.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RecommendDepartmentScreen;
