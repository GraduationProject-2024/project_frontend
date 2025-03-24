import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import axios from 'axios';
import styles from '../../styles/RecordAndTranslate/RecordAndTranslateStyles';

const RecordAndTranslateScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [messages, setMessages] = useState([]);
  let speakerIndex = 0;

  const BASE_URL = 'http://52.78.79.53:5002/transapi';

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
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'recorded_audio.wav',
    });
  }, []);

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

      let translatedText = '';

      const excludeWords = ['you', 'Thank you', 'Bye'];
      if (
        excludeWords.includes(transcript) ||
        excludeWords.includes(englishTranslation) ||
        excludeWords.includes(koreanTranslation)
      ) {
        console.log('⚠️ 필터링된 문장:', transcript);
        return;
      }

      let isKoreanToEnglish = transcript === koreanTranslation;
      let isEnglishToKorean = transcript === englishTranslation;

      if (isKoreanToEnglish) {
        translatedText = englishTranslation;
      } else if (isEnglishToKorean) {
        translatedText = koreanTranslation;
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
    if (!isRecording) {
      let currentSessionId = sessionId || (await startSession());
      if (!currentSessionId) {
        return;
      }
      setSessionId(currentSessionId);
      setIsRecording(true);
      setIsPaused(false);
      AudioRecord.start();
    } else {
      setIsRecording(false);
      setIsPaused(false);
      const filePath = await AudioRecord.stop();
      await sendAudioChunk(filePath);
      await endSession();
    }
  };

  const handlePausePress = async () => {
    if (!sessionId || !isRecording) {
      return;
    }
    const filePath = await AudioRecord.stop();
    await sendAudioChunk(filePath);

    speakerIndex = speakerIndex === 0 ? 1 : 0;

    AudioRecord.start();
  };

  return (
    <View style={styles.container}>
      {!isRecording && messages.length === 0 && (
        <Text style={styles.titleText}>
          의료진과 환자의 원활한 소통을 돕기 위해서 {'\n'}음성 녹음 및 실시간
          번역을 제공합니다.
        </Text>
      )}
      {!isRecording && messages.length === 0 && (
        <Text style={styles.infoText}>아이콘을 눌러 녹음을 시작해주세요.</Text>
      )}
      <ScrollView
        style={styles.messageContainer}
        contentContainerStyle={styles.scrollContent}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.isEnglishToKorean ? styles.speakerA : styles.speakerB, // 영어 → 한국어 (오른쪽)
              msg.isEnglishToKorean ? styles.alignRight : styles.alignLeft, // 위치 반전
            ]}>
            {/* 원본 문장 */}
            <Text style={styles.messageText}>{msg.text}</Text>

            {/* 번역된 문장 (파란색) */}
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
