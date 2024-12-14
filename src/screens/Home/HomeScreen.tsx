import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import HomeStyles from '../../styles/Home/HomeStyles';
import HomeProfileScreen from '../../components/Home/HomeProfileScreen';

const HomeScreen = () => {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleButtonPress = label => {
    if (selectedButtons.includes(label)) {
      setSelectedButtons(selectedButtons.filter(item => item !== label));
    } else {
      setSelectedButtons([...selectedButtons, label]);
    }
  };

  const handleStartPress = () => {
    if (selectedButtons.length > 0) {
      console.log('Selected sections:', selectedButtons);
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
        <View style={HomeStyles.iconContainer}>
          <TouchableOpacity>
            <Image
              source={require('../../img/Home/notificationIcon.png')}
              style={HomeStyles.notificationIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../img/Home/profileIcon.png')}
              style={HomeStyles.notificationIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <HomeProfileScreen />

      {/* AI Pre-Diagnosis Section */}
      <View style={HomeStyles.diagnosisSection}>
        <Text style={HomeStyles.sectionTitle}>AI 사전 문진 바로 시작하기</Text>
        <Text style={HomeStyles.sectionSubtitle}>
          치료가 필요하신 부분을 선택해주세요
        </Text>
        <View style={HomeStyles.buttonGrid}>
          {[
            '전신',
            '머리',
            '정신',
            '얼굴',
            '목',
            '가슴/등',
            '복부',
            '생식/비뇨기',
            '팔/손',
            '다리/발',
            '뼈/근육',
            '피부',
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
        <Text style={HomeStyles.sectionSubtitle}>
          메디코의 서비스를 한 눈에 볼 수 있어요
        </Text>
        <View style={HomeStyles.menuGrid}>
          {[
            {
              icon: require('../../img/Home/aidiagnosisIcon.png'),
              label: 'AI 사전 문진',
            },
            {
              icon: require('../../img/Home/recommendhospitalIcon.png'),
              label: '병원 추천',
            },
            {
              icon: require('../../img/Home/recommendpharmacyIcon.png'),
              label: '약국 추천',
            },
            {
              icon: require('../../img/Home/recommendemergencyIcon.png'),
              label: '응급실 추천',
            },
            {
              icon: require('../../img/Home/translatelanguageIcon.png'),
              label: '언어 변환',
            },
            {
              icon: require('../../img/Home/recordtranslateIcon.png'),
              label: '녹음 및 번역',
            },
            {
              icon: require('../../img/Home/rescuemessageIcon.png'),
              label: '119 문자 신고',
            },
            {
              icon: require('../../img/Home/communityIcon.png'),
              label: '커뮤니티',
            },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={HomeStyles.menuItem}>
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
