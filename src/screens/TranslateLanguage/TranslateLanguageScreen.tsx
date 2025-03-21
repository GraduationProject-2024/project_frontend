import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import TranslateLanguageStyles from '../../styles/TranslateLanguage/TranslateLanguageStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';
import i18n from '../../locales/i18n';
import {useTranslation} from 'react-i18next';

const TranslateLanguageScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    {label: '한국어', value: 'ko'},
    {label: 'English', value: 'en'},
    {label: 'Tiếng Việt', value: 'vi'},
    {label: '中国人(简体)', value: 'zh-cn'},
    {label: '中国人(繁体)', value: 'zh-tw'},
  ];

  const handleLanguageChange = language => {
    setSelectedLanguage(language.value);
    i18n.changeLanguage(language.value);
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
          onPress={handleConfirmLanguageChange}
        >
          <Text style={TranslateLanguageStyles.buttonText}>
            {t('언어 변환')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen;
