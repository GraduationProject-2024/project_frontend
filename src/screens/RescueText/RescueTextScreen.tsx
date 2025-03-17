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
import ConsentModal from '../../components/RescueText/ConsentModal';

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

  const handleConsentComplete = () => {
    setConsentModalVisible(false);
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
              {/* 안내 문구 */}
              <Text style={styles.titleText}>
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  119 웹 신고
                </Text>
                를 할 수 있습니다. {'\n'}
                항목을 입력하지 않아도 신고가 접수되지만, {'\n'}원활한 신고를
                위해서는 입력하는 것을 권장드립니다.
              </Text>

              {/* 주소 입력 섹션 */}
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
              {/* 제목 입력 섹션 */}
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

              {/* 신고 내용 입력 */}
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

              {/* 응급 사항 유형 선택 */}
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
