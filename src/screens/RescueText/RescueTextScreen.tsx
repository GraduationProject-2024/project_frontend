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
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/RescueText/RescueTextStyles';
import ConsentModal from '../../components/RescueText/ConsentModal';

const USER_API_URL = 'http://52.78.79.53:8081/api/v1/member/form';
const REPORT_API_URL = 'http://52.78.79.53:5001/reportapi/fill_form';

const RescueTextScreen = () => {
  const {t} = useTranslation();
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
  const [isConsentModalVisible, setConsentModalVisible] = useState(true);
  const [images, setImages] = useState([]);

  const emergencyTypes = [
    {label: t('화재'), value: 'Fire'},
    {label: t('구조 요청'), value: 'Salvage'},
    {label: t('응급 상황'), value: 'Emergency'},
    {label: t('교통 사고'), value: 'Traffic Accident'},
    {label: t('재난'), value: 'Disaster'},
    {label: t('기타'), value: 'Etc'},
  ];

  const handleEmergencyTypeSelect = selectedValue => {
    setSelectedEmergencyType(selectedValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
    fetchData();
  }, []);

  const handleConsentComplete = () => {
    setConsentModalVisible(false);
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('⚠️ 액세스 토큰이 없습니다.');
        return;
      }

      const response = await fetch(USER_API_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📌 사용자 데이터 응답 상태 코드:', response.status);

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (jsonError) {
        responseBody = await response.text(); // JSON 파싱이 실패하면 텍스트 그대로 출력
      }

      console.log('📨 사용자 데이터 응답 바디:', responseBody);

      if (response.ok) {
        setUserData(responseBody);
      } else {
        console.error('❌ 사용자 데이터 가져오기 실패:', responseBody);
      }
    } catch (error) {
      console.error('❌ 사용자 데이터 요청 중 오류 발생:', error);
    }
  };

  // ✅ useEffect에서 fetchUserData 호출 유지
  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert(t('이미지는 최대 3개까지 첨부할 수 있습니다.'));
      return;
    }

    const response = await launchImageLibrary({mediaType: 'photo'});

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('Image picker error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      setImages(prevImages => [...prevImages, response.assets[0].uri]);
    }
  };

  const removeImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert(t('🚨 액세스 토큰이 없습니다. 로그인이 필요합니다.'));
        return;
      }

      const formData = new FormData();

      const appendIfNotEmpty = (key, value) => {
        formData.append(key, value ? value : null);
      };

      appendIfNotEmpty('name', userData.name);
      appendIfNotEmpty('number', userData.number);
      appendIfNotEmpty('119_gen_pw', userData.password);

      appendIfNotEmpty('incident_location', address.trim() || userData.address);
      appendIfNotEmpty('address', detailedAddress.trim() || userData.address);

      appendIfNotEmpty('emergency_type', selectedEmergencyType);
      appendIfNotEmpty('title', title.trim());
      appendIfNotEmpty('content', additionalInfo.trim());

      images.forEach((uri, index) => {
        formData.append(`file_${index + 1}`, {
          uri,
          name: `image_${index + 1}.jpg`,
          type: 'image/jpeg',
        });
      });

      // 🔹 FormData가 제대로 생성되었는지 확인
      console.log('📌 수정된 FormData 내용:');
      console.log(JSON.stringify(formData, null, 2));

      const response = await fetch(REPORT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // 🔹 서버 응답 출력
      console.log('📌 서버 응답 상태 코드:', response.status);

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (jsonError) {
        responseBody = await response.text(); // JSON 파싱이 실패하면 텍스트 출력
      }

      console.log('📨 서버 응답 바디:', responseBody);

      if (responseBody.status === 'success') {
        Alert.alert(t('🚨 신고가 성공적으로 접수되었습니다.'));
      } else {
        Alert.alert(
          t('❌ 신고 실패: ') + (responseBody.message || '알 수 없는 오류'),
        );
      }
    } catch (error) {
      console.error('❌ 신고 요청 중 오류 발생:', error);
      Alert.alert(t('🚨 신고 요청 중 오류가 발생했습니다.'));
    }
  };

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
                {t(
                  '119 웹 신고를 할 수 있습니다. 신고 접수를 위해 정보를 입력해주세요. 입력하지 않고 신고 버튼만 누르셔도 신고가 가능합니다.',
                )}
              </Text>

              <View style={styles.addressContainer}>
                <Text style={styles.labelText}>{t('주소 입력')}</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder={t('도로명 주소 입력')}
                  placeholderTextColor="#B1B1B1"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={styles.detailedAddressInput}
                  placeholder={t('상세 주소 입력')}
                  placeholderTextColor="#B1B1B1"
                  value={detailedAddress}
                  onChangeText={setDetailedAddress}
                />
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.labelText}>{t('제목 입력')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('제목을 입력해주세요')}
                  placeholderTextColor="#B1B1B1"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.additionalInfoContainer}>
                <Text style={styles.labelText}>{t('신고 내용 입력')}</Text>
                <View style={styles.inputWithIconAndCounterContainer}>
                  <TextInput
                    style={styles.textInputWithIconAndCounter}
                    multiline
                    placeholder={t('신고 내용을 입력해주세요')}
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
                <Text style={styles.labelText}>{t('응급 사항 유형')}</Text>
                <View style={styles.toggleContainer}>
                  {emergencyTypes.map(type => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.toggleButton,
                        selectedEmergencyType === type.value &&
                          styles.selectedToggleButton,
                      ]}
                      onPress={() => handleEmergencyTypeSelect(type.value)}>
                      <Text
                        style={
                          selectedEmergencyType === type.value
                            ? styles.selectedToggleText
                            : styles.toggleText
                        }>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.imageUploadContainer}>
                <Text style={styles.labelText}>
                  {t('신고 관련 이미지 추가')}
                </Text>
                <Text style={styles.titleText}>
                  {t('*이미지는 3개 이하로 첨부 가능합니다')}
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReport}>
            <Text style={styles.submitButtonText}>{t('119 신고하기')}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default RescueTextScreen;
