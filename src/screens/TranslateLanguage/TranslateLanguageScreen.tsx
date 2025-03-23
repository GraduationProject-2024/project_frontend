import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import TranslateLanguageStyles from '../../styles/TranslateLanguage/TranslateLanguageStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';
import RNRestart from 'react-native-restart';
import {changeAppLanguage} from '../../locales/i18n';

const TranslateLanguageScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    {label: '한국어', value: 'ko', apiValue: 'KO'},
    {label: 'English', value: 'en', apiValue: 'EN'},
    {label: 'Tiếng Việt', value: 'vi', apiValue: 'VI'},
    {label: '简体中文', value: 'zhCN', apiValue: 'ZH_CN'},
    {label: '繁體中文', value: 'zhTW', apiValue: 'ZH_TW'},
  ];

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      return token;
    } catch (error) {
      console.error('❌ 액세스 토큰 가져오기 실패:', error.message);
      return null;
    }
  };

  const updateLanguageOnServer = async apiLanguage => {
    try {
      setLoading(true);
      console.log(`🌍 서버에 언어 변경 요청 중... ${apiLanguage}`);

      const token = await getAccessToken();
      if (!token) {
        Alert.alert(t('오류'), t('로그인이 필요합니다.'));
        return null;
      }

      const response = await fetch(
        'http://52.78.79.53:8081/api/v1/basicInfo/language',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({language: apiLanguage}),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `서버 응답 오류: ${response.status}, 메시지: ${errorText}`,
        );
      }

      const responseData = await response.json();
      console.log('✅ 서버 언어 변경 성공:', responseData);
      return responseData.language;
    } catch (error) {
      console.error('❌ 서버 언어 변경 실패:', error.message);
      Alert.alert(
        '오류',
        `서버와 통신 중 오류가 발생했습니다. \n ${error.message}`,
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLanguageChange = async () => {
    if (!pendingLanguage) {
      Alert.alert(t('오류'), t('변경할 언어를 선택해주세요.'));
      return;
    }

    if (i18n.language === pendingLanguage.value) {
      Alert.alert(t('알림'), t('이미 선택된 언어입니다.'));
      return;
    }

    const updatedLanguage = await updateLanguageOnServer(
      pendingLanguage.apiValue,
    );
    if (!updatedLanguage) {
      return;
    }

    await changeAppLanguage(pendingLanguage.value);

    Alert.alert(
      t('언어 변경'),
      t('언어가 변경되었습니다. 앱이 재시작됩니다.'),
      [
        {
          text: t('취소'),
          style: 'cancel',
        },
        {
          text: t('확인'),
          onPress: () => {
            console.log('🔥 앱을 재시작합니다.');
            RNRestart.restart();
          },
        },
      ],
    );
  };

  return (
    <View style={TranslateLanguageStyles.container}>
      <FlatList
        data={languages}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              TranslateLanguageStyles.languageItem,
              pendingLanguage?.value === item.value &&
                TranslateLanguageStyles.selectedLanguageItem,
            ]}
            onPress={() => setPendingLanguage(item)}
            disabled={loading}>
            <Text style={TranslateLanguageStyles.languageText}>
              {item.label}
            </Text>
            {pendingLanguage?.value === item.value && (
              <Image
                source={CheckIcon}
                style={TranslateLanguageStyles.languageIcon}
              />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={item => item.value}
        style={TranslateLanguageStyles.languageList}
      />

      <View style={TranslateLanguageStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            TranslateLanguageStyles.button,
            pendingLanguage
              ? TranslateLanguageStyles.activeButton
              : TranslateLanguageStyles.disabledButton,
          ]}
          disabled={!pendingLanguage || loading}
          onPress={handleConfirmLanguageChange}>
          <Text style={TranslateLanguageStyles.buttonText}>
            {loading ? t('변경 중...') : t('언어 변환')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen;
