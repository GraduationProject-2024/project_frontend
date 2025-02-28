import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import TranslateLanguageStyles from '../../styles/TranslateLanguage/TranslateLanguageStyles';
import TranslateLanguageAlertScreen from '../../components/TranslateLanguage/TranslateLanguageAlertScreen';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const TranslateLanguageScreen = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    '한국어',
    'English',
    'Tiếng Việt',
    '中国人(简体)',
    '中国人(繁体)',
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={TranslateLanguageStyles.languageItem}
      onPress={() => setSelectedLanguage(item)}>
      <Text style={TranslateLanguageStyles.languageText}>{item}</Text>
      {selectedLanguage === item && (
        <Image
          source={CheckIcon}
          style={TranslateLanguageStyles.languageIcon}
        />
      )}
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  return (
    <View style={TranslateLanguageStyles.container}>
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={TranslateLanguageStyles.languageList}
      />

      <View style={TranslateLanguageStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            TranslateLanguageStyles.button,
            {
              backgroundColor: selectedLanguage ? '#2527BF' : '#B5B5B5',
            },
          ]}
          disabled={!selectedLanguage}
          onPress={() => setModalVisible(true)}>
          <Text style={TranslateLanguageStyles.buttonText}>언어 변환</Text>
        </TouchableOpacity>
      </View>

      <TranslateLanguageAlertScreen
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        selectedLanguage={selectedLanguage}
      />
    </View>
  );
};

export default TranslateLanguageScreen;
