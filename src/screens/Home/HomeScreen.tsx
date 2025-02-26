import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import HomeStyles from '../../styles/Home/HomeStyles';
import HomeProfileScreen from '../../components/Home/HomeProfileScreen';

const HomeScreen = () => {
  const [selectedButtons, setSelectedButtons] = useState([]);
  const navigation = useNavigation();

  const handleButtonPress = label => {
    if (selectedButtons.includes(label)) {
      setSelectedButtons(selectedButtons.filter(item => item !== label));
    } else if (selectedButtons.length < 2) {
      setSelectedButtons([...selectedButtons, label]);
    } else {
      console.log('최대 두 개만 선택할 수 있습니다.');
    }
  };

  const handleStartPress = () => {
    if (selectedButtons.length > 0) {
      navigation.navigate('ChooseMainBody', {
        selectedBodyParts: selectedButtons,
      });
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
        <Text style={HomeStyles.sectionTitle}>AI 사전 문진 바로 시작하기</Text>
        <Text style={HomeStyles.sectionSubtitle}>
          치료가 필요하신 부분을 선택해주세요
        </Text>
        <View style={HomeStyles.buttonGrid}>
          {[
            '근골격',
            '피부',
            '머리/정신',
            '얼굴',
            '목',
            '가슴',
            '폐/위',
            '등/허리',
            '복부',
            '팔',
            '다리',
            '엉덩이/비뇨기',
            '기타',
          ].map((label, index) => (
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
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[
            HomeStyles.startButton,
            !isStartButtonActive && HomeStyles.disabledButton,
          ]}
          onPress={handleStartPress}
          disabled={!isStartButtonActive}>
          <Text style={HomeStyles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Section */}
      <View style={HomeStyles.menuSection}>
        <Text style={HomeStyles.sectionTitle}>메뉴 바로 가기</Text>
        <View style={HomeStyles.menuGrid}>
          {[
            {
              icon: require('../../img/Home/aidiagnosisIcon.png'),
              label: 'AI 사전 문진',
              onPress: () => navigation.navigate('ChooseMainBody'),
            },
            {
              icon: require('../../img/Home/recommendhospitalIcon.png'),
              label: '병원 추천',
              onPress: () => navigation.navigate('RecommendDepartment'),
            },
            {
              icon: require('../../img/Home/recommendpharmacyIcon.png'),
              label: '약국 추천',
              onPress: () => navigation.navigate('RecommendPharmacyList'),
            },
            {
              icon: require('../../img/Home/recommendemergencyIcon.png'),
              label: '응급실 추천',
              onPress: () => navigation.navigate('RecommendEmergencyList'),
            },
            {
              icon: require('../../img/Home/translatelanguageIcon.png'),
              label: '언어 변환',
              onPress: () => navigation.navigate('TranslateLanguage'),
            },
            {
              icon: require('../../img/Home/recordtranslateIcon.png'),
              label: '녹음 및 번역',
              onPress: () => navigation.navigate('RecordAndTranslate'),
            },
            {
              icon: require('../../img/Home/rescuemessageIcon.png'),
              label: '119 문자 신고',
              onPress: () => navigation.navigate('RescueText'),
            },
            {
              icon: require('../../img/Home/profileIcon.png'),
              label: '개인 정보',
              onPress: () => navigation.navigate('SymptomOnsetTime'),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={HomeStyles.menuItem}
              onPress={item.onPress}>
              <Image source={item.icon} style={HomeStyles.menuIcon} />
              <Text style={HomeStyles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
