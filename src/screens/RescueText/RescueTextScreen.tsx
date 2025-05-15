import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
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
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {ActivityIndicator} from 'react-native';

const USER_API_URL = 'http://52.78.79.53:8081/api/v1/member/form';
const REPORT_API_URL = 'http://52.78.79.53:5001/reportapi/fill_form';

const RescueTextScreen = () => {
  const {t} = useTranslation();
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
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

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
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
        responseBody = await response.text();
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

      console.log('📌 수정된 FormData 내용:');

      const response = await fetch(REPORT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📌 서버 응답 상태 코드:', response.status);

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (jsonError) {
        responseBody = await response.text();
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

  const handleAddressPlaceholderPress = async () => {
    if (isGettingLocation) {
      return;
    }
    setIsGettingLocation(true);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('위치 권한이 필요합니다.');
      setIsGettingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('현재 위치:', latitude, longitude);
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${GOOGLE_MAPS_API_KEY}`,
          );
          console.log('구글 지오코딩 응답:', response.data);
          if (
            response.data.status === 'OK' &&
            response.data.results &&
            response.data.results.length > 0
          ) {
            setAddress(response.data.results[0].formatted_address);
          } else {
            Alert.alert('주소를 찾을 수 없습니다.');
          }
        } catch (error) {
          Alert.alert('주소 변환 오류', error.message);
        }
        setIsGettingLocation(false);
      },
      error => {
        Alert.alert('위치 정보 오류', error.message);
        setIsGettingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
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
            <ScrollView>
              <Text style={styles.titleText}>
                {t(
                  '119 웹 신고를 할 수 있습니다. 신고 접수를 위해 정보를 입력해주세요. 입력하지 않고 신고 버튼만 누르셔도 신고가 가능합니다.',
                )}
              </Text>
              <View style={styles.addressContainer}>
                <Text style={styles.labelText}>{t('주소 입력')}</Text>
                <View style={{position: 'relative', justifyContent: 'center'}}>
                  <TextInput
                    placeholder={
                      isGettingLocation
                        ? '주소를 받아오는 중...'
                        : '도로명 주소 입력'
                    }
                    value={address}
                    editable={true}
                    onFocus={handleAddressPlaceholderPress}
                    style={styles.addressInput}
                  />
                  {isGettingLocation && (
                    <ActivityIndicator
                      size="small"
                      color="#888"
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        marginTop: -10,
                      }}
                    />
                  )}
                </View>
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
