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
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pan = useRef(new Animated.Value(0)).current;
  const symptomId = route.params?.symptomId;

  useEffect(() => {
    if (symptomId) {
      console.log('📌 Navigated with symptomId:', symptomId);
      submitReport(symptomId);
    }
  }, [symptomId]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 50) {
          setIsPatientView(true);
        }
        if (gesture.dx < -50) {
          setIsPatientView(false);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start();
      },
    }),
  ).current;

  const submitReport = async symptomId => {
    setLoading(true);
    const token = await getAccessToken();
    if (!token) {
      console.error('Failed to get access token');
      setLoading(false);
      return;
    }

    const requestBody = {
      symptomId: symptomId,
    };

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
      setReportData(responseData);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isPatientView && styles.activeToggle]}
          onPress={() => setIsPatientView(true)}>
          <Text
            style={[
              styles.toggleText,
              isPatientView && styles.activeToggleText,
            ]}>
            {t('환자용')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isPatientView && styles.activeToggle]}
          onPress={() => setIsPatientView(false)}>
          <Text
            style={[
              styles.toggleText,
              !isPatientView && styles.activeToggleText,
            ]}>
            {t('의사용')}
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.swipeContainer, {transform: [{translateX: pan}]}]}
        {...panResponder.panHandlers}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : isPatientView ? (
            reportData?.patient ? (
              <>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('진료과')}</Text>
                  <Text style={styles.sectionContent}>
                    {reportData.patient.department?.KO}
                  </Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('예상 질병')}</Text>
                  <Text style={styles.sectionContent}>
                    {reportData.patient.possible_conditions?.[0]?.KO}
                  </Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>
                    {t('의사에게 할 질문 추천')}
                  </Text>
                  {reportData.patient.questions_to_doctor?.map((q, i) => (
                    <Text key={i} style={styles.sectionContent}>
                      {q.KO}
                    </Text>
                  ))}
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>
                    {t('예상 질병 체크리스트')}
                  </Text>
                  {reportData.patient.symptom_checklist?.[0]?.symptoms?.map(
                    (s, i) => (
                      <Text key={i} style={styles.sectionContent}>
                        {s.KO}
                      </Text>
                    ),
                  )}
                </View>
              </>
            ) : (
              <Text>{t('데이터 없음')}</Text>
            )
          ) : reportData?.doctor ? (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('예상 질병')}</Text>
                <Text style={styles.sectionContent}>
                  {reportData.doctor.possible_conditions?.[0]?.KO}
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 신체 선택')}</Text>
                {reportData.doctor.body_info?.[0]?.sbp_body
                  ?.concat(reportData.doctor.body_info?.[0]?.mbp_body || [])
                  .map((part, i) => (
                    <Text key={i} style={styles.sectionContent}>
                      {part}
                    </Text>
                  ))}
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('세부 증상 선택')}</Text>
                {reportData.doctor.symptom_info?.map((info, i) => (
                  <Text
                    key={i}
                    style={
                      styles.sectionContent
                    }>{`강도: ${info.intensity}, 시작: ${info.start}, 지속: ${info.duration}, 추가정보: ${info.additional}`}</Text>
                ))}
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('이미지 업로드')}</Text>
                {reportData.doctor.image_info?.length > 0 ? (
                  reportData.doctor.image_info.map((img, i) => (
                    <Image key={i} source={{uri: img}} style={styles.image} />
                  ))
                ) : (
                  <Text>{t('이미지 없음')}</Text>
                )}
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 기본 정보')}</Text>
                <Text
                  style={
                    styles.sectionContent
                  }>{`나이: ${reportData.doctor.basic_info?.[0]?.age}, 키: ${reportData.doctor.basic_info?.[0]?.height}, 성별: ${reportData.doctor.basic_info?.[0]?.gender}, 체중: ${reportData.doctor.basic_info?.[0]?.weight}`}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 건강 정보')}</Text>
                <Text
                  style={
                    styles.sectionContent
                  }>{`과거 병력: ${reportData.doctor.health_info?.[0]?.past_history}, 알레르기: ${reportData.doctor.health_info?.[0]?.allergy}, 가족력: ${reportData.doctor.health_info?.[0]?.family_history}, 현재 복용 약물: ${reportData.doctor.health_info?.[0]?.now_medicine}`}</Text>
              </View>
            </>
          ) : (
            <Text>{t('데이터 없음')}</Text>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default AIHistoryTakingReportScreen;
