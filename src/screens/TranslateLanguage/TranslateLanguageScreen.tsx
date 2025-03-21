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
import TranslateLanguageStyles from '../../styles/TranslateLanguage/TranslateLanguageStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';
import i18n from '../../locales/i18n';
import {useTranslation} from 'react-i18next';

const TranslateLanguageScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    const languageChangedHandler = () => {
      setSelectedLanguage(i18n.language);
      setForceUpdate(prev => prev + 1); // 강제 리렌더링
    };

    i18n.on('languageChanged', languageChangedHandler);

    return () => {
      i18n.off('languageChanged', languageChangedHandler);
    };
  }, []);

  const languages = [
    {label: '한국어', value: 'ko'},
    {label: 'English', value: 'en'},
    {label: 'Tiếng Việt', value: 'vi'},
    {label: '中国人(简体)', value: 'zh-cn'},
    {label: '中国人(繁体)', value: 'zh-tw'},
  ];

  const handleLanguageChange = async language => {
    await i18n.changeLanguage(language.value);
    await AsyncStorage.setItem('appLanguage', language.value); // 언어 저장
    console.log(`🌍 언어 변경: ${language.value}`);
    setForceUpdate(prev => prev + 1); // 🔥 강제 리렌더링 추가
  };

  const handleConfirmLanguageChange = () => {
    Alert.alert(
      t('언어 변경'),
      t('언어가 변경되었습니다. 홈 화면으로 이동하시겠습니까?'),
      [
        {text: t('취소'), style: 'cancel'},
        {text: t('확인'), onPress: () => navigation.navigate('Home')},
      ],
    );
  };

  return (
    <View style={TranslateLanguageStyles.container}>
      <FlatList
        data={languages}
        renderItem={({item}) => (
          <TouchableOpacity
            style={TranslateLanguageStyles.languageItem}
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
            {backgroundColor: selectedLanguage ? '#2527BF' : '#B5B5B5'},
          ]}
          disabled={!selectedLanguage}
          onPress={handleConfirmLanguageChange}>
          <Text style={TranslateLanguageStyles.buttonText}>
            {t('언어 변환')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen;
