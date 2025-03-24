import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import HomeStyles from '../../styles/Home/HomeStyles';
import HomeProfileScreen from '../../components/Home/HomeProfileScreen';

const API_BASE_URL = 'http://52.78.79.53:8081/api/v1';

const HomeScreen = () => {
  const {t, i18n} = useTranslation();
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const languageChangedHandler = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    };

    i18n.on('languageChanged', languageChangedHandler);

    return () => {
      i18n.off('languageChanged', languageChangedHandler);
    };
  }, [navigation, i18n]);

  const getAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'noonsong',
          password: 'noonsong',
        }),
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.accessToken);
      setAccessToken(data.accessToken);
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  const fetchBodyParts = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/main-body/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      setBodyParts(data.map(item => item.description));
    } catch (error) {
      console.error('신체 항목 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
      } else {
        await getAccessToken();
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchBodyParts();
    }
  }, [accessToken]);

  const handleButtonPress = label => {
    if (selectedButtons.includes(label)) {
      setSelectedButtons(selectedButtons.filter(item => item !== label));
    } else if (selectedButtons.length < 2) {
      setSelectedButtons([...selectedButtons, label]);
    } else {
      console.log('최대 두 개만 선택할 수 있습니다.');
    }
  };

  const handleStartPress = async () => {
    if (selectedButtons.length > 0) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          throw new Error('액세스 토큰이 없습니다.');
        }

        const response = await fetch(`${API_BASE_URL}/selected-mbp`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({description: selectedButtons}),
        });

        if (!response.ok) {
          throw new Error('주요 신체 부위 저장 실패');
        }

        const responseData = await response.json();
        console.log(
          '📤 주요 신체 부위 저장 성공:',
          JSON.stringify(responseData, null, 2),
        );

        navigation.navigate('ChooseDetailBody', {
          selectedBodyParts: selectedButtons,
          selectedMBPId: responseData.selectedMBPId,
        });
      } catch (error) {
        console.error('주요 신체 부위 저장 중 오류 발생:', error);
      }
    }
  };

  const isStartButtonActive = selectedButtons.length > 0;

  return (
    <ScrollView style={HomeStyles.container}>
      {/* Header Section */}
      <View style={HomeStyles.header}>
        <Image
          source={require('../../img/Home/MEDIKO.png')}
          style={HomeStyles.logo}
        />
      </View>

      {/* Profile Section */}
      <View style={HomeStyles.homeprofilesection}>
        <HomeProfileScreen />
      </View>

      {/* AI Pre-Diagnosis Section */}
      <View style={HomeStyles.diagnosisSection}>
        <Text style={HomeStyles.sectionTitle}>
          {t('AI 사전 문진 바로 시작하기')}
        </Text>
        <Text style={HomeStyles.sectionSubtitle}>
          {t('치료가 필요하신 부분을 선택해주세요')}
        </Text>
        <View style={HomeStyles.buttonGrid}>
          {bodyParts.length > 0 ? (
            bodyParts.map((label, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  HomeStyles.diagnosisButton,
                  selectedButtons.includes(label) && HomeStyles.selectedButton,
                ]}
                onPress={() => handleButtonPress(label)}>
                <Text
                  style={[
                    HomeStyles.diagnosisButtonText,
                    selectedButtons.includes(label) &&
                      HomeStyles.selectedButtonText,
                  ]}>
                  {t(label)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={HomeStyles.loadingText}>
              {t('신체 데이터를 불러오는 중...')}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            HomeStyles.startButton,
            !isStartButtonActive && HomeStyles.disabledButton,
          ]}
          onPress={handleStartPress}
          disabled={!isStartButtonActive}>
          <Text style={HomeStyles.startButtonText}>{t('시작하기')}</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Section */}
      <View style={HomeStyles.menuSection}>
        <Text style={HomeStyles.sectionTitle}>{t('메뉴 바로 가기')}</Text>
        <View style={HomeStyles.menuGrid}>
          {[
            {
              icon: require('../../img/Home/aidiagnosisIcon.png'),
              label: t('AI 사전 문진'),
              onPress: () => navigation.navigate('ChooseMainBody'),
            },
            {
              icon: require('../../img/Home/recommendhospitalIcon.png'),
              label: t('병원 추천'),
              onPress: () => navigation.navigate('RecommendDepartment'),
            },
            {
              icon: require('../../img/Home/recommendpharmacyIcon.png'),
              label: t('약국 추천'),
              onPress: () => navigation.navigate('RecommendPharmacyList'),
            },
            {
              icon: require('../../img/Home/recommendemergencyIcon.png'),
              label: t('응급실 추천'),
              onPress: () => navigation.navigate('CurrentCondition'),
            },
            {
              icon: require('../../img/Home/translatelanguageIcon.png'),
              label: t('언어 변환'),
              onPress: () => navigation.navigate('TranslateLanguage'),
            },
            {
              icon: require('../../img/Home/recordtranslateIcon.png'),
              label: t('녹음 및 번역'),
              onPress: () => navigation.navigate('RecordAndTranslate'),
            },
            {
              icon: require('../../img/Home/rescuemessageIcon.png'),
              label: t('119 신고'),
              onPress: () => navigation.navigate('RescueText'),
            },
            {
              icon: require('../../img/Home/profileIcon.png'),
              label: t('개인 정보'),
              onPress: () => navigation.navigate('MyInformation'),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={HomeStyles.menuItem}
              onPress={item.onPress}>
              <Image source={item.icon} style={HomeStyles.menuIcon} />
              <Text style={HomeStyles.menuText}>{t(item.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
