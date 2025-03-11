import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ChooseLanguageStyles from '../../styles/ChooseLanguage/ChooseLanguageStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const ChooseLanguageScreen = ({navigation}) => {
  const route = useRoute();
  const memberId = route.params?.memberId
    ? parseInt(route.params.memberId, 10)
    : null; // long으로 변환

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    {label: '한국어', code: 'KO'},
    {label: 'English', code: 'EN'},
    {label: 'Tiếng Việt', code: 'VI'},
    {label: '中国人(简体)', code: 'ZH_CN'},
    {label: '中国人(繁体)', code: 'ZH_TW'},
  ];

  const handleLanguageSelection = async () => {
    if (!selectedLanguage || memberId === null || isNaN(memberId)) {
      Alert.alert('Error', '회원 정보를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://52.78.79.53:8081/api/v1/basicInfo/language?memberId=${memberId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({language: selectedLanguage.code}),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `서버 오류: ${response.status}`);
      }

      Alert.alert('성공', '언어 설정이 저장되었습니다.');
      navigation.navigate('MedicalInformation', {memberId});
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert(
        '네트워크 오류',
        error.message || '언어 설정을 저장하는 동안 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={ChooseLanguageStyles.languageItem}
      onPress={() => setSelectedLanguage(item)}>
      <Text style={ChooseLanguageStyles.languageText}>{item.label}</Text>
      {selectedLanguage?.code === item.code && (
        <Image source={CheckIcon} style={ChooseLanguageStyles.languageIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={ChooseLanguageStyles.container}>
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        style={ChooseLanguageStyles.languageList}
      />

      <View style={ChooseLanguageStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            ChooseLanguageStyles.button,
            {backgroundColor: selectedLanguage ? '#2527BF' : '#B5B5B5'},
          ]}
          disabled={!selectedLanguage || loading}
          onPress={handleLanguageSelection}>
          <Text style={ChooseLanguageStyles.buttonText}>
            {loading ? '저장 중...' : '선택 완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseLanguageScreen;
