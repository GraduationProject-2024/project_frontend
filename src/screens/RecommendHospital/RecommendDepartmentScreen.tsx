import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
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
  const [selectedDepartment, setSelectedDepartment] = useState(null); // 추가됨
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가

  // 특정 진료과 정보를 가져오는 API 함수
  const fetchDepartmentDetail = async title => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      const response = await axios.get(`${API_URL}/${title}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSelectedDepartment(response.data);
      setModalVisible(true); // 모달 열기
    } catch (err) {
      console.error(
        '특정 진료과 정보 요청 실패:',
        err.response?.status,
        err.response?.data,
      );
      setError(`정보를 불러오지 못했습니다: ${err.message}`);
    }
  };

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
          onPress={() => fetchDepartmentDetail(department.title)} // 클릭 시 상세 정보 요청
        >
          <Text style={styles.title}>{department.title}</Text>
          <Text style={styles.description}>{department.description}</Text>
        </TouchableOpacity>
      ))}

      {/* 특정 진료과 상세 정보를 보여주는 모달 */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedDepartment ? (
              <>
                <Text style={styles.modalTitle}>
                  {selectedDepartment.title}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedDepartment.description}
                </Text>
                <Button title="닫기" onPress={() => setModalVisible(false)} />
              </>
            ) : (
              <Text>정보를 불러오는 중...</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default RecommendDepartmentScreen;
