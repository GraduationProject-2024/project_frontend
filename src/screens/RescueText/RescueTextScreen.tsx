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
import styles from '../../styles/RescueText/RescueTextStyles';

const RescueTextScreen = () => {
  const [title, setTitle] = useState('');
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
      response => {
        if (response.didCancel) {
          Alert.alert('이미지 선택이 취소되었습니다.');
        } else if (response.errorCode) {
          Alert.alert('에러 발생:', response.errorMessage);
        } else if (response.assets) {
          const newImages = response.assets.map(asset => asset.uri);
          setImages(prevImages => [...prevImages, ...newImages].slice(0, 10));
        }
      },
    );
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
          <Text style={styles.headerText}>119 문자 신고</Text>

          {/* 제목 입력 섹션 */}
          <View style={styles.titleContainer}>
            <Text style={styles.labelText}>+ 제목 입력</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력해주세요"
              placeholderTextColor="#B1B1B1"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 이미지 업로드 섹션 */}
          <View style={styles.imageUploadContainer}>
            <Text style={styles.labelText}>+ 신고 관련 이미지 추가</Text>
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
            <Text style={styles.labelText}>+ 신고 내용 입력</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="신고하는 상황 및 내용을 작성해주세요"
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

      <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipButtonText}>119 문자 신고하기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default RescueTextScreen;
