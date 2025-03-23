import React, {useState, useRef, useEffect} from 'react';
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
    const token = await getAccessToken();
    if (!token) {
      console.error('Failed to get access token');
      return;
    }

    const requestBody = {
      symptomId: symptomId,
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
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
      console.log('📌 Response:', responseData);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
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
          {isPatientView ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('진료과')}</Text>
              <Text style={styles.sectionContent}>내과</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('환자 기본정보')}</Text>
              <Text style={styles.sectionContent}>
                체중: 70kg / 키: 175cm / 나이: 30 / 성별: 남성
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default AIHistoryTakingReportScreen;
