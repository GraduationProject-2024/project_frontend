import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/Home/HomeProfileStyles';

const HomeProfileScreen = () => {
  const {t} = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [pastHistory, setPastHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [nowMedicine, setNowMedicine] = useState('');
  const [allergy, setAllergy] = useState('');

  const fetchNickname = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        'http://52.78.79.53:8081/api/v1/member/nickname',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNickname(data.nickname);
    } catch (error) {
      console.error(t('Error fetching nickname:'), error);
    }
  };

  const fetchBasicInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://52.78.79.53:8081/api/v1/basicInfo', {
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
      setGender(data.gender === 'MALE' ? t('남성') : t('여성'));
      setAge(data.age);
    } catch (error) {
      console.error(t('Error fetching basic info:'), error);
    }
  };

  const fetchHealthInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        'http://52.78.79.53:8081/api/v1/healthInfo',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPastHistory(data.pastHistory);
      setFamilyHistory(data.familyHistory);
      setNowMedicine(data.nowMedicine);
      setAllergy(data.allergy);
    } catch (error) {
      console.error(t('Error fetching health info:'), error);
    }
  };

  useEffect(() => {
    fetchNickname();
    fetchBasicInfo();
    fetchHealthInfo();
  }, []);

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.profileContainer}>
      {/* Front Side */}
      <Animated.View
        style={[
          styles.profileCard,
          {
            transform: [{rotateY: frontInterpolate}],
            backfaceVisibility: 'hidden',
          },
          !isFlipped && {zIndex: 1},
        ]}>
        <TouchableOpacity onPress={handleFlip} style={styles.arrowRightButton}>
          <Image
            source={require('../../img/Home/arrowRightIcon.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image
            source={require('../../img/Home/profileImage.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileText}>
              {nickname} {t('님')}
            </Text>
            <Text style={styles.profileSubText}>
              {gender}, {t('만')} {age} {t('세')}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View
        style={[
          styles.profileCard,
          styles.profileBack,
          {
            transform: [{rotateY: backInterpolate}],
            backfaceVisibility: 'hidden',
          },
          isFlipped && {zIndex: 1},
        ]}>
        <TouchableOpacity onPress={handleFlip} style={styles.arrowLeftButton}>
          <Image
            source={require('../../img/Home/arrowLeftIcon.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.healthInfo}>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>{t('과거병력')}</Text>
            <Text style={styles.healthValue}>{pastHistory}</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>{t('가족력')}</Text>
            <Text style={styles.healthValue}>{familyHistory}</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>{t('복용하는 약')}</Text>
            <Text style={styles.healthValue}>{nowMedicine}</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>{t('알레르기')}</Text>
            <Text style={styles.healthValue}>{allergy}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default HomeProfileScreen;
