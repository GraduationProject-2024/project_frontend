import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import axios from 'axios';
import styles from '../../styles/RecordAndTranslate/RecordAndTranslateStyles';

const RecordAndTranslateScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [translations, setTranslations] = useState({});
  const [audioFilePath, setAudioFilePath] = useState(null);

  const BASE_URL = 'http://52.78.79.53:5002';

  // ✅ 앱 실행 시 액세스 토큰 로드
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
          console.log('✅ 액세스 토큰 로드 완료:', token);
        } else {
          console.warn('⚠️ 저장된 액세스 토큰이 없음.');
        }
      } catch (error) {
        console.error('🚨 액세스 토큰 로드 실패:', error);
      }
    };
    getAccessToken();
  }, []);

  // ✅ `react-native-fs`가 정상적으로 작동하는지 확인
  useEffect(() => {
    console.log('📂 RNFS Document Directory:', RNFS.DocumentDirectoryPath);
  }, []);

  // ✅ 오디오 녹음 설정 초기화
  useEffect(() => {
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'recorded_audio.wav',
    });
  }, []);

  // ✅ 세션 시작 API 호출
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
            Connection: 'Keep-Alive',
          },
          timeout: 10000, // 10초 대기
        },
      );

      if (response.data.session_id) {
        console.log('✅ 세션 시작 성공:', response.data);
        setSessionId(response.data.session_id);
        return response.data.session_id; // 세션 ID 반환
      } else {
        console.warn('⚠️ 세션 ID를 받지 못함:', response.data);
        return null;
      }
    } catch (error) {
      console.error('🚨 세션 시작 실패:', error.message);
      return null;
    }
  };

  // ✅ 녹음 시작/중지 버튼 핸들러
  const handleRecordPress = async () => {
    if (!isRecording) {
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        console.log('⚠️ 세션 ID가 없음. 세션을 시작합니다...');
        currentSessionId = await startSession(); // 반환된 세션 ID 사용
      }

      if (!currentSessionId) {
        console.error('🚨 세션 시작 실패로 인해 녹음을 시작할 수 없습니다.');
        return;
      }

      console.log(`✅ 세션 ID 확인 완료: ${currentSessionId}`);
      setSessionId(currentSessionId); // 상태 업데이트

      console.log('🎙 녹음 시작...');
      setIsRecording(true);
      AudioRecord.start();
    } else {
      console.log('🛑 녹음 중지...');
      setIsRecording(false);
      const audioFile = await AudioRecord.stop();

      console.log('📁 녹음된 파일:', audioFile);
      processAudio(audioFile);
    }
  };

  // ✅ 오디오 파일을 base64로 변환 후 API 호출
  const processAudio = async filePath => {
    try {
      console.log('📂 오디오 파일 처리 시작:', filePath);

      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        console.error('🚨 파일이 존재하지 않음:', filePath);
        return;
      }

      const fileStat = await RNFS.stat(filePath);
      console.log(`📏 파일 크기: ${fileStat.size} bytes`);

      if (fileStat.size === 0) {
        console.error('🚨 파일 크기가 0이므로 API 요청을 하지 않습니다.');
        return;
      }

      let audioBase64 = await RNFS.readFile(filePath, 'base64');
      console.log(`🔹 변환된 base64 길이: ${audioBase64.length}`);

      // 🔥 Base64 패딩(`=`)을 보장
      while (audioBase64.length % 4 !== 0) {
        audioBase64 += '=';
      }

      console.log('✅ Base64 패딩 추가 완료');

      console.log('🔹 API 요청 준비 완료. 세션 ID:', sessionId);
      if (!sessionId) {
        console.error('🚨 세션 ID가 없음. API 요청을 중단합니다.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/audio_chunk`,
        {
          session_id: sessionId,
          audio: audioBase64,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            Connection: 'Keep-Alive',
            'Content-Length': audioBase64.length.toString(),
          },
          timeout: 30000,
        },
      );

      console.log('✅ 오디오 처리 성공:', response.data);
      setTranscript(response.data.transcript);
      setTranslations(response.data.translations);
    } catch (error) {
      console.error('🚨 오디오 처리 실패:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isRecording ? '음성 인식 중 ...' : '음성 녹음을 시작해주세요'}
      </Text>
      <Text style={styles.transcript}>🎤 인식된 문장: {transcript}</Text>

      {Object.keys(translations).length > 0 && (
        <View>
          {Object.keys(translations).map(lang => (
            <Text key={lang} style={styles.translation}>
              {lang}: {translations[lang].text}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={handleRecordPress}>
        <Text>{isRecording ? '🛑 녹음 중지' : '🎙 녹음 시작'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecordAndTranslateScreen;
