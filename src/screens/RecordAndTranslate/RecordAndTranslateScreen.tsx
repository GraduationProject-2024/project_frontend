import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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
  const [transcript, setTranscript] = useState('');
  const [translations, setTranslations] = useState({});

  const BASE_URL = 'http://52.78.79.53:5002/transapi';

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        let token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.log('🔑 액세스 토큰이 없음. 새로 요청 중...');
          const response = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'your-username',
            password: 'your-password',
          });
          token = response.data.access_token;
          await AsyncStorage.setItem('accessToken', token);
          console.log('✅ 새 액세스 토큰 저장 완료:', token);
        } else {
          console.log('✅ 저장된 액세스 토큰 로드 완료:', token);
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
        console.warn('⚠️ 액세스 토큰이 없어 API 요청을 중단합니다.');
        return null;
      }
      console.log('🔹 세션 시작 요청 중...');
      const response = await axios.post(
        `${BASE_URL}/start_session`,
        {member_id: '3'},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 10000,
        },
      );
      if (response.data.session_id) {
        console.log('✅ 세션 시작 성공:', response.data);
        setSessionId(response.data.session_id);
        return response.data.session_id;
      } else {
        console.warn('⚠️ 세션 ID를 받지 못함:', response.data);
        return null;
      }
    } catch (error) {
      console.error('🚨 세션 시작 실패:', error.message);
      return null;
    }
  };

  const handleRecordPress = async () => {
    if (!isRecording) {
      console.log('🎬 녹음 시작 버튼 클릭');
      let currentSessionId = sessionId || (await startSession());
      if (!currentSessionId) {
        return;
      }
      setSessionId(currentSessionId);
      setIsRecording(true);
      setIsPaused(false);
      AudioRecord.start();
    } else {
      console.log('🛑 녹음 중지 및 세션 종료');
      setIsRecording(false);
      setIsPaused(false);
      AudioRecord.stop();
      setSessionId(null);
    }
  };

  const handlePausePress = () => {
    if (isPaused) {
      console.log('🎙 녹음 다시 시작');
      setIsPaused(false);
      AudioRecord.start();
    } else {
      console.log('⏸ 녹음 일시 중지');
      setIsPaused(true);
      AudioRecord.stop();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isRecording ? '음성 인식 중 ...' : '음성 녹음을 시작해주세요'}
      </Text>
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
      <Text style={styles.transcript}>🎤 인식된 문장: {transcript}</Text>
    </View>
  );
};

export default RecordAndTranslateScreen;
