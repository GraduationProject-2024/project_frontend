import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/RescueText/RescueTextStyles';
import ConsentModal from '../../components/RescueText/ConsentModal';

const API_URL = 'http://52.78.79.53:8081/api/v1/member/form';

const emergencyTypes = [
  '화재',
  '구조 요청',
  '응급 상황',
  '교통 사고',
  '재난',
  '기타',
];

const RescueTextScreen = () => {
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
  const [isConsentModalVisible, setConsentModalVisible] = useState(true);
  const [images, setImages] = useState([]);

  const handleConsentComplete = () => {
    setConsentModalVisible(false);
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      alert('이미지는 최대 3개까지 첨부할 수 있습니다.');
      return;
    }
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImages([...images, response.assets[0].uri]);
      }
    });
  };

  const removeImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('🚨 액세스 토큰이 없습니다.');
        return;
      }

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ API 응답 데이터:', data);
      console.log('👤 사용자 이름:', data.name);
      console.log('📞 전화번호:', data.number);
      console.log('📍 주소:', data.address);
      console.log('🔑 비밀번호(암호화됨):', data.password);
    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <ConsentModal
        visible={isConsentModalVisible}
        onClose={handleConsentComplete}
      />

      {!isConsentModalVisible && (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}>
              <Text style={styles.titleText}>
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  119 웹 신고
                </Text>
                를 할 수 있습니다. {'\n'}
                항목을 입력하지 않아도 신고가 접수되지만, {'\n'}원활한 신고를
                위해서는 입력하는 것을 권장드립니다.
              </Text>

              <View style={styles.addressContainer}>
                <Text style={styles.labelText}>주소 입력</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="도로명 주소 입력"
                  placeholderTextColor="#B1B1B1"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={styles.detailedAddressInput}
                  placeholder="상세 주소 입력"
                  placeholderTextColor="#B1B1B1"
                  value={detailedAddress}
                  onChangeText={setDetailedAddress}
                />
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.labelText}>제목 입력</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="제목을 입력해주세요"
                  placeholderTextColor="#B1B1B1"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.additionalInfoContainer}>
                <Text style={styles.labelText}>신고 내용 입력</Text>
                <View style={styles.inputWithIconAndCounterContainer}>
                  <TextInput
                    style={styles.textInputWithIconAndCounter}
                    multiline
                    placeholder="신고 내용을 입력해주세요"
                    placeholderTextColor="#B1B1B1"
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    maxLength={200}
                  />
                  <Image
                    source={require('../../img/RescueText/MicrophoneButton.png')}
                    style={styles.microphoneIconInside}
                  />
                  <Text style={styles.characterCountInside}>
                    {additionalInfo.length}/200
                  </Text>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.labelText}>응급 사항 유형</Text>
                <View style={styles.toggleContainer}>
                  {emergencyTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.toggleButton,
                        selectedEmergencyType === type &&
                          styles.selectedToggleButton,
                      ]}
                      onPress={() => setSelectedEmergencyType(type)}>
                      <Text
                        style={
                          selectedEmergencyType === type
                            ? styles.selectedToggleText
                            : styles.toggleText
                        }>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.imageUploadContainer}>
                <Text style={styles.labelText}>신고 관련 이미지 추가</Text>
                <Text style={styles.titleText}>
                  *이미지는 3개 이하로 첨부 가능합니다
                </Text>
                <ScrollView horizontal>
                  {images.length < 3 && (
                    <TouchableOpacity
                      style={styles.imageUploadButton}
                      onPress={pickImage}>
                      <Image
                        source={require('../../img/AdditionalInformation/AddImage.png')}
                        style={styles.imageIcon}
                      />
                    </TouchableOpacity>
                  )}

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
            </ScrollView>
          </TouchableWithoutFeedback>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>119 신고하기</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default RescueTextScreen;
