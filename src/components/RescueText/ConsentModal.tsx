import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/RescueText/ConsentModalStyles';

const ConsentModal = ({visible, onClose}) => {
  const {t, i18n} = useTranslation();
  const [allChecked, setAllChecked] = useState(false);
  const [personalInfoChecked, setPersonalInfoChecked] = useState(false);
  const [locationInfoChecked, setLocationInfoChecked] = useState(false);
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    const languageChangedHandler = () => {
      setForceUpdate(prev => prev + 1);
    };

    i18n.on('languageChanged', languageChangedHandler);
    return () => {
      i18n.off('languageChanged', languageChangedHandler);
    };
  }, []);

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

  useEffect(() => {
    if (personalInfoChecked && locationInfoChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [personalInfoChecked, locationInfoChecked]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.modalTitle}>{t('약관 동의')}</Text>
          <Text style={styles.modalSubtitle}>
            {t('약관에 동의하셔야 119 문자 신고가 가능합니다')}
          </Text>
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
              <Text style={styles.checkText}>{t('약관 전체 동의')}</Text>
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
                {t('개인 정보 수집 및 이용 동의 (필수)')}
              </Text>
              <Image
                source={require('../../img/RescueText/RightIcon.png')}
                style={styles.rightIcon}
              />
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
              <Text style={styles.checkText}>
                {t('위치 정보 수집 및 이용 동의(필수)')}
              </Text>
              <Image
                source={require('../../img/RescueText/RightIcon.png')}
                style={styles.rightIcon}
              />
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  personalInfoChecked && locationInfoChecked
                    ? '#2527BF'
                    : '#B5B5B5',
              },
            ]}
            onPress={onClose}
            disabled={!(personalInfoChecked && locationInfoChecked)}>
            <Text style={styles.submitButtonText}>{t('동의 완료')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConsentModal;
