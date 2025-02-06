import React, {useState} from 'react';
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
import styles from '../../styles/RescueText/RescueTextStyles';
import ConsentModal from '../../components/RescueText/ConsentModal'; // 약관 모달 추가

const RescueTextScreen = () => {
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isConsentModalVisible, setConsentModalVisible] = useState(true); // 약관 모달 상태 추가

  const handleConsentComplete = () => {
    // 약관 동의 완료 시 모달 닫기
    setConsentModalVisible(false);
  };

  return (
    <>
      {/* 약관 모달 */}
      <ConsentModal
        visible={isConsentModalVisible}
        onClose={handleConsentComplete} // 동의 완료 콜백
      />

      {!isConsentModalVisible && (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {/* 주소 입력 섹션 */}
              <View style={styles.addressContainer}>
                <Text style={styles.labelText}>주소 입력</Text>
                <Text style={styles.helperText}>
                  현 위치의 주소를 GPS로 연동해 자동으로 입력합니다
                </Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="GPS 연동 자동 입력"
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
              {/* 신고 내용 입력 */}
              <View style={styles.additionalInfoContainer}>
                <Text style={styles.labelText}>신고 내용 입력</Text>
                <Text style={styles.helperText}>
                  신고하는 사고/사건/상황 혹은 당사자 여부 등을 작성해주세요{' '}
                  {'\n'}
                  직접 내용을 작성하는 것이 어렵다면 음성으로 입력해주세요
                </Text>
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
            </ScrollView>
          </TouchableWithoutFeedback>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>119 문자 전송하기</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default RescueTextScreen;
