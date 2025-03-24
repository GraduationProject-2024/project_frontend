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
import styles from '../../styles/AIHistoryTaking/AIHistoryTakingReportStyles';

const AIHistoryTakingReportScreen = ({route}) => {
  const {t} = useTranslation();
  const {reportData} = route.params;
  const [isPatientView, setIsPatientView] = useState(true);
  const pan = useRef(new Animated.Value(0)).current;

  // 스와이프 이벤트 처리 (환자용 <-> 의사용 변경)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
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
      {/* 환자용 / 의사용 토글 버튼 */}
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

      {/* 스와이프 가능한 화면 */}
      <Animated.View
        style={[styles.swipeContainer, {transform: [{translateX: pan}]}]}
        {...panResponder.panHandlers}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {reportData ? (
            isPatientView ? (
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
                    <Text key={i} style={styles.sectionContent}>
                      {t('강도')}: {info.intensity}, {t('시작')}: {info.start},{' '}
                      {t('지속')}: {info.duration}, {t('추가정보')}:{' '}
                      {info.additional}
                    </Text>
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
                  <Text style={styles.sectionContent}>
                    {t('나이')}: {reportData.doctor.basic_info?.[0]?.age},{' '}
                    {t('키')}: {reportData.doctor.basic_info?.[0]?.height},{' '}
                    {t('성별')}: {reportData.doctor.basic_info?.[0]?.gender},{' '}
                    {t('체중')}: {reportData.doctor.basic_info?.[0]?.weight}
                  </Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{t('환자 건강 정보')}</Text>
                  <Text style={styles.sectionContent}>
                    {t('과거 병력')}:{' '}
                    {reportData.doctor.health_info?.[0]?.past_history},{' '}
                    {t('알레르기')}:{' '}
                    {reportData.doctor.health_info?.[0]?.allergy}, {t('가족력')}
                    : {reportData.doctor.health_info?.[0]?.family_history},{' '}
                    {t('현재 복용 약물')}:{' '}
                    {reportData.doctor.health_info?.[0]?.now_medicine}
                  </Text>
                </View>
              </>
            ) : (
              <Text>{t('데이터 없음')}</Text>
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
