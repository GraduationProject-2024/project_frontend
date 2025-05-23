import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/RecordAndTranslate/RecordAndTranslateStyles';

const RecordAndTranslateScreen = () => {
  const {t} = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  let speakerIndex = 0;

  const BASE_URL = 'http://52.78.79.53:5002/transapi';

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        let token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          const response = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'your-username',
            password: 'your-password',
          });
          token = response.data.access_token;
          await AsyncStorage.setItem('accessToken', token);
        }
        setAccessToken(token);
      } catch (error) {
        console.error('🚨 액세스 토큰 로드 실패:', error);
      }
    };
    getAccessToken();
  }, []);

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '마이크 권한 요청',
            message: '녹음을 위해 마이크 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('🎤 마이크 권한 허용됨');
        } else {
          console.log('🚨 마이크 권한 거부됨');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestMicrophonePermission();
  }, []);

  useEffect(() => {
    try {
      console.log('🎤 AudioRecord 초기화 시작');

      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'recorded_audio.wav',
      });

      setIsAudioInitialized(true);
      console.log('✅ AudioRecord 초기화 완료');
    } catch (error) {
      console.error('❌ AudioRecord 초기화 실패:', error);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRecording]);

  const startSession = async () => {
    try {
      if (!accessToken) {
        return null;
      }
      const response = await axios.post(
        `${BASE_URL}/start_session`,
        {member_id: '3'},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );

      console.log('🚀 세션 시작 응답:', response.data);

      setSessionId(response.data.session_id);
      return response.data.session_id;
    } catch (error) {
      console.error('🚨 세션 시작 실패:', error);
      return null;
    }
  };

  const endSession = async () => {
    try {
      if (!sessionId || !accessToken) {
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/end_session`,
        {session_id: sessionId},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );

      console.log('🛑 세션 종료 응답:', response.data);

      setSessionId(null);
      speakerIndex++;
    } catch (error) {
      console.error('🚨 세션 종료 실패:', error);
    }
  };

  const sendAudioChunk = async filePath => {
    try {
      if (!sessionId || !accessToken) {
        return;
      }
      const audioData = await RNFS.readFile(filePath, 'base64');
      const response = await axios.post(
        `${BASE_URL}/audio_chunk`,
        {session_id: sessionId, audio: audioData},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );

      console.log('🔊 오디오 청크 전송 응답:', response.data);

      const transcript = response.data.transcript?.trim();
      const translations = response.data.translations || {};
      const englishTranslation = translations.English?.text?.trim() || '';
      const koreanTranslation = translations.Korean?.text?.trim() || '';

      const excludeWords = ['you', 'Thank you', 'Bye'];
      if (
        excludeWords.includes(transcript) ||
        excludeWords.includes(englishTranslation) ||
        excludeWords.includes(koreanTranslation)
      ) {
        console.log('⚠️ 필터링된 문장:', transcript);
        return;
      }

      let isKoreanToEnglish =
        transcript &&
        koreanTranslation &&
        transcript.trim().replace(/\s/g, '') ===
          koreanTranslation.trim().replace(/\s/g, '');

      let isEnglishToKorean =
        transcript &&
        englishTranslation &&
        transcript.trim().replace(/\s/g, '') ===
          englishTranslation.trim().replace(/\s/g, '');

      let translatedText = '';

      if (isKoreanToEnglish && englishTranslation) {
        translatedText = englishTranslation;
      } else if (isEnglishToKorean && koreanTranslation) {
        translatedText = koreanTranslation;
      } else if (englishTranslation || koreanTranslation) {
        translatedText = englishTranslation || koreanTranslation;
      }

      console.log('📖 최종 번역된 텍스트:', translatedText);

      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: transcript,
          translation: translatedText,
          isEnglishToKorean: isEnglishToKorean,
          isKoreanToEnglish: isKoreanToEnglish,
        },
      ]);
    } catch (error) {
      console.error('🚨 오디오 전송 실패:', error);
    }
  };

  const handleRecordPress = async () => {
    if (!isAudioInitialized) {
      console.log('🚨 AudioRecord가 아직 초기화되지 않았습니다!');
      return;
    }

    if (!isRecording) {
      // 🔹 녹음 시작
      setIsRecording(true);
      const currentSessionId = sessionId || (await startSession());
      if (!currentSessionId) {
        return;
      }
      setSessionId(currentSessionId);

      console.log('🎙️ 녹음 시작');
      AudioRecord.start();
    } else {
      console.log('🛑 녹음 중단');
      setIsRecording(false);
      setSessionId(null);

      const filePath = await AudioRecord.stop();
      await sendAudioChunk(filePath);
      await endSession();
    }
  };

  const handlePausePress = async () => {
    if (!sessionId || !isRecording) {
      return;
    }

    if (!isPaused) {
      const filePath = await AudioRecord.stop();
      await sendAudioChunk(filePath);

      speakerIndex = speakerIndex === 0 ? 1 : 0;
      setIsPaused(true);
      console.log('⏸️ 녹음 일시 정지됨');
    } else {
      setIsPaused(false);
      setTimeout(() => {
        AudioRecord.start();
        console.log('▶️ 녹음 재개');
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      {!isRecording && messages.length === 0 && (
        <Text style={styles.titleText}>
          {t(
            '의료진과 환자의 원활한 소통을 돕기 위해서 음성 녹음 및 실시간 번역을 제공합니다.',
          )}
        </Text>
      )}
      {!isRecording && messages.length === 0 && (
        <Text style={styles.infoText}>
          {t('아이콘을 눌러 녹음을 시작해주세요.')}
        </Text>
      )}
      <ScrollView
        style={styles.messageContainer}
        contentContainerStyle={styles.scrollContent}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.isEnglishToKorean ? styles.speakerA : styles.speakerB,
              msg.isEnglishToKorean ? styles.alignRight : styles.alignLeft,
            ]}>
            <Text style={styles.messageText}>{msg.text}</Text>

            {msg.translation ? (
              <Text style={styles.translationText}>{msg.translation}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonBackground} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={
              !sessionId
                ? require('../../img/RecordAndTranslate/TutorialButton.png')
                : require('../../img/RecordAndTranslate/DeleteButton.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleRecordPress}>
            <Image
              source={
                !isRecording
                  ? require('../../img/RecordAndTranslate/RecordButton.png')
                  : require('../../img/RecordAndTranslate/RecordinProgressButton.png')
              }
              style={styles.recordIcon}
            />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.iconButton} onPress={handlePausePress}>
          <Image
            source={
              !sessionId
                ? require('../../img/RecordAndTranslate/FileButton.png')
                : require('../../img/RecordAndTranslate/DoneButton.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecordAndTranslateScreen;
