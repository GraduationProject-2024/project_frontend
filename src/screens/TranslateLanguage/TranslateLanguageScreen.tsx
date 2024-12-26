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

const TranslateLanguageScreen = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = ['한국어', 'English', '中国人', 'Tiếng Việt', 'Монгол'];

  const showConfirmationModal = () => {
    if (selectedLanguage) {
      Alert.alert(
        '언어 변경',
        `언어를 ${selectedLanguage}로 변경하시겠습니까?`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '변경',
            onPress: () => navigation.navigate('Home'),
          },
        ],
        {cancelable: true},
      );
    }
  };

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
          onPress={showConfirmationModal}>
          <Text style={TranslateLanguageStyles.buttonText}>언어 변환</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateLanguageScreen;
