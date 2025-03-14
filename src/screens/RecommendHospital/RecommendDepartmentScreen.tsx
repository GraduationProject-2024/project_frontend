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

  // 전체 진료과 리스트 가져오기
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      let accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        throw new Error('토큰이 없어 데이터를 불러올 수 없습니다.');
      }

      const response = await axios.get(API_URL, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('✅ 진료과 데이터 수신:', response.data);
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
          onPress={() => {
            console.log('📌 선택된 진료과:', department);
            navigation.navigate('RecommendHospitalList', {
              selectedDepartment: department.title, // ✅ title이 아닌 id가 필요한지 확인
            });
          }}>
          <Text style={styles.title}>{department.title}</Text>
          <Text style={styles.description}>{department.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RecommendDepartmentScreen;
