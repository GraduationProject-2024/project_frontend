import React, {useState, useEffect} from 'react';
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
import {changeAppLanguage} from '../../locales/i18n'; // ✅ 변경된 언어 변경 함수 가져오기

const TranslateLanguageScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    {label: '한국어', value: 'ko'},
    {label: 'English', value: 'en'},
    {label: 'Tiếng Việt', value: 'vi'},
    {label: '中国人(简体)', value: 'zh-cn'},
    {label: '中国人(繁体)', value: 'zh-tw'},
  ];

  const handleLanguageChange = async language => {
    console.log(`🌍 언어 변경 요청: ${language.value}`);

    // ✅ 현재 언어와 동일한 경우 변경하지 않음
    if (i18n.language === language.value) {
      console.log('ℹ️ 동일한 언어 선택됨, 변경하지 않음.');
      return;
    }

    await changeAppLanguage(language.value); // ✅ `i18n.ts`에 정의된 변경 함수 사용

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
              selectedLanguage === item.value &&
                TranslateLanguageStyles.selectedLanguageItem,
            ]}
            onPress={() => handleLanguageChange(item)}>
            <Text style={TranslateLanguageStyles.languageText}>
              {item.label}
            </Text>
            {selectedLanguage === item.value && (
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
            selectedLanguage
              ? TranslateLanguageStyles.activeButton
              : TranslateLanguageStyles.disabledButton,
          ]}
          disabled={!selectedLanguage}
          onPress={() => handleLanguageChange({value: selectedLanguage})}>
          <Text style={TranslateLanguageStyles.buttonText}>
            {t('언어 변환')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen;
