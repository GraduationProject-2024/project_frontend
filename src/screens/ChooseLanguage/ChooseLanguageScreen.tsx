import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import ChooseLanguageStyles from '../../styles/ChooseLanguage/ChooseLanguageStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const ChooseLanguageScreen = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = ['한국어', 'English', '中国人', 'Tiếng Việt', 'Монгол'];

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={ChooseLanguageStyles.languageItem}
      onPress={() => setSelectedLanguage(item)}>
      <Text style={ChooseLanguageStyles.languageText}>{item}</Text>
      {selectedLanguage === item && (
        <Image source={CheckIcon} style={ChooseLanguageStyles.languageIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={ChooseLanguageStyles.container}>
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={ChooseLanguageStyles.languageList}
      />

      <View style={ChooseLanguageStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            ChooseLanguageStyles.button,
            {
              backgroundColor: selectedLanguage ? '#2527BF' : '#B5B5B5',
            },
          ]}
          disabled={!selectedLanguage}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={ChooseLanguageStyles.buttonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseLanguageScreen;
