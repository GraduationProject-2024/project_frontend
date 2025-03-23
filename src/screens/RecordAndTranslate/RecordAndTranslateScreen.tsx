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
      setSessionId(response.data.session_id);
      return response.data.session_id;
    } catch (error) {
      console.error('🚨 세션 시작 실패:', error);
      return null;
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
      console.log('📝 인식된 문장:', response.data.transcript);
      setTranscript(response.data.transcript);
      setTranslations(response.data.translations);
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
      setSessionId(null);
    }
  };

  const handlePausePress = async () => {
    if (isPaused) {
      setIsPaused(false);
      AudioRecord.start();
    } else {
      setIsPaused(true);
      const filePath = await AudioRecord.stop();
      await sendAudioChunk(filePath);
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
