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

      // 응답 전체를 출력
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

      // 응답 데이터를 콘솔에 전체 출력
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

      // 응답 전체를 출력
      console.log('🔊 오디오 청크 전송 응답:', response.data);

      setMessages(prevMessages => [
        ...prevMessages,
        {text: response.data.transcript, speaker: speakerIndex % 2},
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
              msg.speaker === 0 ? styles.speakerA : styles.speakerB,
            ]}>
            <Text style={styles.messageText}>{msg.text}</Text>
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
