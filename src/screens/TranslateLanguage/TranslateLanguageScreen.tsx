import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import TranslateLanguageStyles from '../../styles/TranslateLanguage/TranslateLanguageStyles';
import TranslateLanguageAlertScreen from '../../components/TranslateLanguage/TranslateLanguageAlertScreen';
import CheckIcon from '../../img/ChooseLanguage/Check.png';
import i18n from '../../locales/i18n'; // ✅ i18n import 확인
import {useTranslation} from 'react-i18next';

const TranslateLanguageScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    {label: '한국어', value: 'ko'},
    {label: 'English', value: 'en'},
    {label: 'Tiếng Việt', value: 'vi'},
    {label: '中国人(简体)', value: 'zh-cn'},
    {label: '中国人(繁体)', value: 'zh-tw'},
  ];

  const handleLanguageChange = language => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language.value);
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
            {selectedLanguage?.value === item.value && (
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
          disabled={!selectedLanguage}>
          <Text style={TranslateLanguageStyles.buttonText}>
            {t('언어 변환')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen; // ✅ 반드시 default export!
