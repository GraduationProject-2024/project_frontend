import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/AIHistoryTakingReportStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/report';

const DUMMY_DATA = {
  patient: {
    department: {KO: '정형외과'},
    possible_conditions: [
      {KO: '슬관절염'},
      {KO: '비타민 D 결핍증'},
      {KO: '골절'},
      {KO: '퇴행성 관절염'},
      {KO: '통풍'},
    ],
    questions_to_doctor: [
      {KO: '슬관절염의 가능성은 얼마나 됩니까?'},
      {KO: '비타민 D 결핍증이 이런 증상을 일으킬 수 있나요?'},
      {KO: '골절의 가능성은 얼마나 됩니까?'},
      {KO: '퇴행성 관절염이 이런 증상을 일으킬 수 있나요?'},
      {KO: '통풍이 이런 증상을 일으킬 수 있나요?'},
    ],
    symptom_checklist: [
      {
        symptoms: [
          {KO: '통증'},
          {KO: '부종'},
          {KO: '형태의 변화'},
          {KO: '운동 불능'},
          {KO: '감각 장애'},
        ],
      },
    ],
  },
  doctor: {
    possible_conditions: [{KO: '슬관절염'}],
    body_info: [
      {
        sbp_body: ['무릎'],
        mbp_body: ['다리'],
      },
    ],
    symptom_info: [
      {
        intensity: '중간',
        start: '1주일 전',
        duration: '3일',
        additional: '운동 후 악화',
      },
    ],
    image_info: [],
    basic_info: [
      {
        age: 45,
        height: 170,
        gender: '남성',
        weight: 70,
      },
    ],
    health_info: [
      {
        past_history: '없음',
        allergy: '없음',
        family_history: '슬관절염 병력 있음',
        now_medicine: '없음',
      },
    ],
  },
};

const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return null;
    }
    console.log('Access Token:', token);
    return token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

const AIHistoryTakingReportScreen = ({route}) => {
  const {t} = useTranslation();
  const [isPatientView, setIsPatientView] = useState(true);
  const [reportData, setReportData] = useState(DUMMY_DATA);
  const [loading, setLoading] = useState(true);
  const pan = useRef(new Animated.Value(0)).current;
  const symptomId = route.params?.symptomId;

  useEffect(() => {
    if (symptomId) {
      console.log('📌 Navigated with symptomId:', symptomId);
      submitReport(symptomId);
    } else {
      setLoading(false);
    }
  }, [symptomId]);

  const submitReport = async symptomId => {
    setLoading(true);
    const token = await getAccessToken();
    if (!token) {
      console.error('Failed to get access token');
      setLoading(false);
      return;
    }

    const requestBody = {symptomId};
    try {
      console.log('📌 Sending request:', JSON.stringify(requestBody));
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      console.log('📌 Response:', JSON.stringify(responseData, null, 2));
      setReportData(responseData || DUMMY_DATA);
    } catch (error) {
      console.error('Error submitting report:', error);
      setReportData(DUMMY_DATA);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text>{isPatientView ? t('환자용') : t('의사용')}</Text>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Text>{JSON.stringify(reportData, null, 2)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AIHistoryTakingReportScreen;
