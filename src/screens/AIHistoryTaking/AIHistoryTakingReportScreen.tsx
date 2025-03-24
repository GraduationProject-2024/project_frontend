import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../styles/AIHistoryTaking/AIHistoryTakingReportStyles';

const API_URL = 'http://52.78.79.53:8081/api/v1/report';

const AIHistoryTakingReportScreen = ({route}) => {
  const {t} = useTranslation();
  const {symptomId} = route.params;
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPatientView, setIsPatientView] = useState(true);
  const pan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);

        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('❌ 액세스 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const requestData = {symptomId};
        console.log('📌 요청 데이터:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(API_URL, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 100000, // 최대 15초까지 대기
          maxContentLength: 50000000, // 최대 10MB 응답 허용
          maxBodyLength: 50000000, // 최대 10MB 요청 허용
        });

        console.log('✅ 응답 데이터:', JSON.stringify(response.data, null, 2));
        setReportData(response.data);
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.error(
            '❌ 요청 시간이 초과되었습니다. 네트워크 상태를 확인하세요.',
          );
        } else {
          console.error('❌ API 요청 실패:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [symptomId]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 10,
    onPanResponderMove: (evt, gestureState) => {
      pan.setValue(gestureState.dx);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        setIsPatientView(true);
      } else if (gestureState.dx < -50) {
        setIsPatientView(false);
      }
      Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start();
    },
  });

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
          {reportData ? (
            isPatientView ? (
              reportData.patient ? (
                <>
                  {/* 진료과 */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                      {t('이런 진료과에 가는 것을 추천해요')}
                    </Text>
                    <Text style={styles.sectionContent}>
                      {reportData.patient.department?.KO || t('데이터 없음')}
                    </Text>
                  </View>

                  {/* 예상 질병 */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                      {t('이런 질병에 걸리신 것 같아요')}
                    </Text>
                    {reportData.patient.possible_conditions?.length > 0 ? (
                      reportData.patient.possible_conditions.map((item, i) => (
                        <Text key={i} style={styles.sectionContent}>
                          {item.KO || t('데이터 없음')}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.sectionContent}>
                        {t('데이터 없음')}
                      </Text>
                    )}
                  </View>

                  {/* 의사에게 할 질문 */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                      {t('의료진에게 이런 것을 질문하세요')}
                    </Text>
                    {reportData.patient.questions_to_doctor?.length > 0 ? (
                      reportData.patient.questions_to_doctor.map((q, i) => (
                        <Text key={i} style={styles.sectionContent}>
                          {q.KO || t('데이터 없음')}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.sectionContent}>
                        {t('데이터 없음')}
                      </Text>
                    )}
                  </View>

                  {/* 증상 체크리스트 */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                      {t('이런 증상이 있는지 확인하세요')}
                    </Text>
                    {reportData.patient.symptom_checklist?.length > 0 ? (
                      reportData.patient.symptom_checklist.map((item, i) => (
                        <View key={i}>
                          <Text style={styles.sectionContent}>
                            {item.condition?.KO || t('데이터 없음')}
                          </Text>
                          {item.symptoms?.map((s, j) => (
                            <Text key={j} style={styles.sectionContent}>
                              - {s.KO || t('데이터 없음')}
                            </Text>
                          ))}
                        </View>
                      ))
                    ) : (
                      <Text style={styles.sectionContent}>
                        {t('데이터 없음')}
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>{t('환자 데이터 없음')}</Text>
              )
            ) : reportData.doctor ? (
              <>
                {/* 환자 기본 정보 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('환자 기본 정보')}</Text>
                  <Text style={styles.sectionContent}>
                    {t('나이')}: {reportData.doctor.basic_info?.[0]?.age || '-'}
                    ,{t(' 키')}:{' '}
                    {reportData.doctor.basic_info?.[0]?.height || '-'},
                    {t(' 성별')}:{' '}
                    {reportData.doctor.basic_info?.[0]?.gender || '-'},
                    {t(' 체중')}:{' '}
                    {reportData.doctor.basic_info?.[0]?.weight || '-'}
                  </Text>
                </View>

                {/* 환자 건강 정보 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('환자 건강 정보')}</Text>
                  <Text style={styles.sectionContent}>
                    {t('과거 병력')}:{' '}
                    {reportData.doctor.health_info?.[0]?.past_history || '-'},
                    {t(' 알레르기')}:{' '}
                    {reportData.doctor.health_info?.[0]?.allergy || '-'},
                    {t(' 가족력')}:{' '}
                    {reportData.doctor.health_info?.[0]?.family_history || '-'},
                    {t(' 현재 복용 약물')}:{' '}
                    {reportData.doctor.health_info?.[0]?.now_medicine || '-'}
                  </Text>
                </View>

                {/* 신체 부위 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('신체 부위')}</Text>
                  <Text style={styles.sectionContent}>
                    {reportData.doctor.body_info?.[0]?.mbp_body?.join(', ') ||
                      '-'}{' '}
                    |{' '}
                    {reportData.doctor.body_info?.[0]?.sbp_body?.join(', ') ||
                      '-'}{' '}
                    |{' '}
                    {reportData.doctor.body_info?.[0]?.sign?.join(', ') || '-'}{' '}
                  </Text>
                </View>

                {/* 세부 증상 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('세부 증상')}</Text>
                  <Text style={styles.sectionContent}>
                    {t('강도')}:{' '}
                    {reportData.doctor.symptom_info?.[0]?.intensity || '-'},
                    {t(' 시작')}:{' '}
                    {reportData.doctor.symptom_info?.[0]?.start || '-'},
                    {t(' 지속')}:{' '}
                    {reportData.doctor.symptom_info?.[0]?.duration || '-'},
                    {t(' 추가 정보')}:{' '}
                    {reportData.doctor.symptom_info?.[0]?.additional || '-'}
                  </Text>
                </View>

                {/* 예상 질병 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('예상 질병')}</Text>
                  {reportData.doctor.possible_conditions?.length > 0 ? (
                    reportData.doctor.possible_conditions.map((item, i) => (
                      <Text key={i} style={styles.sectionContent}>
                        {item.KO || t('데이터 없음')}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.sectionContent}>
                      {t('데이터 없음')}
                    </Text>
                  )}
                </View>

                {/* 이미지 업로드 */}
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('이미지 업로드')}</Text>
                  {reportData.doctor.image_info?.length > 0 ? (
                    reportData.doctor.image_info.map((img, i) => (
                      <Image
                        key={i}
                        source={{uri: img.url}}
                        style={styles.image}
                      />
                    ))
                  ) : (
                    <Text style={styles.sectionContent}>
                      {t('이미지 없음')}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>{t('의사 데이터 없음')}</Text>
            )
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default AIHistoryTakingReportScreen;
