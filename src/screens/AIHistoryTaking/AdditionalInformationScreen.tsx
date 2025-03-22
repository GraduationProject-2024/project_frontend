import React, {useState} from 'react';
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

  if (!symptomId) {
    Alert.alert('Error', '증상 ID가 없습니다.');
    return null;
  }

  const [additionalInfo, setAdditionalInfo] = useState('');
  const [images, setImages] = useState([]);

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
          setImages(prevImages => [...prevImages, ...newImages].slice(0, 10));
          await uploadImages(newImages);
        }
      },
    );
  };

  const uploadImages = async imageUris => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const formData = new FormData();
      imageUris.forEach((uri, index) => {
        formData.append('file', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/symptom/img/${symptomId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('이미지 업로드 실패');
      }

      const result = await response.json();
      console.log('✅ 이미지 업로드 완료:', result);
      Alert.alert('Success', '이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('❌ 이미지 업로드 오류:', error);
      Alert.alert('Error', `이미지 업로드 중 오류 발생: ${error.message}`);
    }
  };

  const removeImage = index => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
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
            <Text style={styles.labelText}>+ 증상 관련 이미지 추가</Text>
            <ScrollView horizontal>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickImage}>
                <Image
                  source={require('C:/project_frontend/src/img/AdditionalInformation/AddImage.png')}
                  style={styles.imageIcon}
                />
              </TouchableOpacity>

              {/* 업로드된 이미지 렌더링 */}
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
            <Text style={styles.labelText}>+ 증상 관련 추가 사항 작성</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="증상에 대해 추가적으로 전달하고 싶은 사항을 작성해주세요"
              placeholderTextColor="#B1B1B1"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              maxLength={200}
            />
            <Text style={styles.characterCount}>
              {additionalInfo.length}/200
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* 건너뛰기 버튼 */}
      <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipButtonText}>건너뛰기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default AdditionalInformationScreen;
