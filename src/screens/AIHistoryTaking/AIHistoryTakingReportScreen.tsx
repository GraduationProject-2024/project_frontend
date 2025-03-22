import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/AIHistoryTaking/AIHistoryTakingReportStyles';

const AIHistoryTakingReportScreen = () => {
  const {t} = useTranslation();
  const [isPatientView, setIsPatientView] = useState(true);

  const pan = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.container}>
      {/* 화면 전환 토글 */}
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
          {isPatientView ? (
            /* 환자용 화면 - 각 섹션마다 개별 카드 적용 */
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('진료과')}</Text>
                <Text style={styles.sectionContent}>내과</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('예상 질병')}</Text>
                <Text style={styles.sectionContent}>감기, 독감</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {t('의사에게 할 질문 추천')}
                </Text>
                <Text style={styles.sectionContent}>
                  열이 난 지 얼마나 되었나요?
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {t('예상 질병 체크리스트')}
                </Text>
                <Text style={styles.sectionContent}>기침, 인후통, 오한</Text>
              </View>
            </>
          ) : (
            /* 의사용 화면 - 각 섹션마다 카드 적용 */
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('예상 질병')}</Text>
                <Text style={styles.sectionContent}>감기, 독감</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 신체 선택')}</Text>
                <Text style={styles.sectionContent}>머리 → 목 → 목 통증</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('세부 증상 선택')}</Text>
                <Text style={styles.sectionContent}>
                  강도: 중간 / 시작시간: 2일 전 / 지속시간: 48시간 / 추가 정보
                  없음
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('이미지 업로드')}</Text>
                <Image
                  source={{uri: 'https://via.placeholder.com/150'}}
                  style={styles.image}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 기본정보')}</Text>
                <Text style={styles.sectionContent}>
                  체중: 70kg / 키: 175cm / 나이: 30 / 성별: 남성
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('환자 건강정보')}</Text>
                <Text style={styles.sectionContent}>
                  알레르기: 없음 / 과거질병: 없음 / 현재 질병: 없음 / 가족력:
                  없음
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default AIHistoryTakingReportScreen;
