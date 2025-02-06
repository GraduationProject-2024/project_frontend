import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import styles from '../../styles/RescueText/ConsentModalStyles';

const ConsentModal = ({visible, onClose}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [personalInfoChecked, setPersonalInfoChecked] = useState(false);
  const [locationInfoChecked, setLocationInfoChecked] = useState(false);

  const handleAllCheck = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setPersonalInfoChecked(newState);
    setLocationInfoChecked(newState);
  };

  const handleIndividualCheck = type => {
    if (type === 'personal') {
      setPersonalInfoChecked(!personalInfoChecked);
    } else if (type === 'location') {
      setLocationInfoChecked(!locationInfoChecked);
    }
  };

  React.useEffect(() => {
    if (personalInfoChecked && locationInfoChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [personalInfoChecked, locationInfoChecked]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>약관 동의</Text>
          <ScrollView>
            <TouchableOpacity style={styles.checkItem} onPress={handleAllCheck}>
              <Image
                source={
                  allChecked
                    ? require('../../img/RescueText/CheckedIcon.png')
                    : require('../../img/RescueText/UncheckedIcon.png')
                }
                style={styles.checkIcon}
              />
              <Text style={styles.checkText}>약관 전체 동의</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkItem}
              onPress={() => handleIndividualCheck('personal')}>
              <Image
                source={
                  personalInfoChecked
                    ? require('../../img/RescueText/CheckedIcon.png')
                    : require('../../img/RescueText/UncheckedIcon.png')
                }
                style={styles.checkIcon}
              />
              <Text style={styles.checkText}>
                개인 정보 수집 및 이용 동의 (필수)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkItem}
              onPress={() => handleIndividualCheck('location')}>
              <Image
                source={
                  locationInfoChecked
                    ? require('../../img/RescueText/CheckedIcon.png')
                    : require('../../img/RescueText/UncheckedIcon.png')
                }
                style={styles.checkIcon}
              />
              <Text style={styles.checkText}>위치 정보 수집 및 이용 동의</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={onClose}
            disabled={!(personalInfoChecked && locationInfoChecked)}>
            <Text style={styles.submitButtonText}>동의 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConsentModal;
