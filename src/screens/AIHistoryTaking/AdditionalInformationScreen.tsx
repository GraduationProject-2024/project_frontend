import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/AdditionalInformationStyles';

const AdditionalInformationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const symptomId = route.params?.symptomId;

  // symptomId 값 확인
  console.log('📌 Received symptomId:', symptomId);

  if (!symptomId) {
    Alert.alert('Error', '증상 ID가 없습니다.');
    return null;
  }

  const [additionalInfo, setAdditionalInfo] = useState('');
  const [images, setImages] = useState([]);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    updateButtonState();
  }, [additionalInfo, images]);

  const updateButtonState = () => {
    setIsButtonActive(additionalInfo.trim().length > 0 || images.length > 0);
  };

  const pickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('최대 10장까지만 업로드할 수 있습니다.');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 1,
        selectionLimit: 10 - images.length,
      },
      async response => {
        if (response.didCancel) {
          Alert.alert('이미지 선택이 취소되었습니다.');
        } else if (response.errorCode) {
          Alert.alert('에러 발생:', response.errorMessage);
        } else if (response.assets) {
          const newImages = response.assets.map(asset => asset.uri);
          setImages(prevImages => {
            const updatedImages = [...prevImages, ...newImages].slice(0, 10);
            updateButtonState();
            return updatedImages;
          });
        }
      },
    );
  };

  const saveAdditionalInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const requestBody = {
        additional: additionalInfo.trim().length > 0 ? additionalInfo : null,
      };

      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/symptom/additional/${symptomId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error('추가 정보 저장 실패');
      }

      const result = await response.json();
      console.log('✅ 추가 정보 저장 완료:', result);
      Alert.alert('Success', '추가 정보가 저장되었습니다.');
    } catch (error) {
      console.error('❌ 추가 정보 저장 오류:', error);
      Alert.alert('Error', `추가 정보 저장 중 오류 발생: ${error.message}`);
    }
  };

  const removeImage = index => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      updateButtonState();
      return updatedImages;
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.headerText}>
            증상에 대해 추가적으로
            {'\n'}
            전달하고 싶은 사항을 알려주세요
          </Text>

          {/* 이미지 업로드 섹션 */}
          <View style={styles.imageUploadContainer}>
            <Text style={styles.labelText}>증상 관련 이미지 추가</Text>
            <ScrollView horizontal>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickImage}>
                <Image
                  source={require('C:/project_frontend/src/img/AdditionalInformation/AddImage.png')}
                  style={styles.imageIcon}
                />
              </TouchableOpacity>
              {images.map((uri, index) => (
                <View key={index} style={styles.uploadedImageContainer}>
                  <Image source={{uri}} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeImage(index)}>
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 추가 정보 입력 */}
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.labelText}>증상 관련 추가 사항 작성</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="증상에 대해 추가적으로 전달하고 싶은 사항을 작성해주세요"
              placeholderTextColor="#B1B1B1"
              value={additionalInfo}
              onChangeText={text => {
                setAdditionalInfo(text);
                updateButtonState();
              }}
              maxLength={200}
            />
            <Text style={styles.characterCount}>
              {additionalInfo.length}/200
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* 버튼 */}
      <TouchableOpacity
        style={[
          styles.skipButton,
          {backgroundColor: isButtonActive ? '#2527BF' : '#B5B5B5'},
        ]}
        onPress={() =>
          navigation.navigate('AIHistoryTakingReport', {symptomId})
        }>
        <Text style={styles.skipButtonText}>
          {isButtonActive ? 'AI 사전문진 확인하기' : '건너뛰기'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default AdditionalInformationScreen;
