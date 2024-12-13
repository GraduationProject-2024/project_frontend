import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import HomeStyles from '../../styles/Home/HomeStyles';

const HomeScreen = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonPress = label => {
    setSelectedButton(label);
  };

  return (
    <ScrollView style={HomeStyles.container}>
      {/* Header Section */}
      <View style={HomeStyles.header}>
        <Image
          source={require('../../img/Login/MEDIKO.png')}
          style={HomeStyles.logo}
        />
        <TouchableOpacity>
          <Image
            source={require('../../img/Home/notificationIcon.png')}
            style={HomeStyles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={HomeStyles.profileSection}>
        <TouchableOpacity>
          <Text style={HomeStyles.backButton}>&lt;</Text>
        </TouchableOpacity>
        <View style={HomeStyles.profileInfo}>
          <Image
            source={require('../../img/Home/profileImage.png')}
            style={HomeStyles.profileImage}
          />
          <View>
            <Text style={HomeStyles.profileText}>눈송이 님</Text>
            <Text style={HomeStyles.profileSubText}>여성, 만 20세</Text>
          </View>
        </View>
        <View style={HomeStyles.healthInfo}>
          <Text style={HomeStyles.healthInfoText}>과거병력</Text>
          <Text style={HomeStyles.healthInfoValue}>당뇨</Text>
          <Text style={HomeStyles.healthInfoText}>가족력</Text>
          <Text style={HomeStyles.healthInfoValue}>고혈압</Text>
          <Text style={HomeStyles.healthInfoText}>복용하는 약</Text>
          <Text style={HomeStyles.healthInfoValue}>당뇨약(혈당 강화제)</Text>
        </View>
      </View>

      {/* AI Pre-Diagnosis Section */}
      <View style={HomeStyles.section}>
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
                selectedButton === label && HomeStyles.selectedButton,
              ]}
              onPress={() => handleButtonPress(label)}>
              <Text
                style={[
                  HomeStyles.diagnosisButtonText,
                  selectedButton === label && HomeStyles.selectedButtonText,
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Menu Section */}
      <View style={HomeStyles.section}>
        <Text style={HomeStyles.sectionTitle}>메뉴 바로 가기</Text>
        <View style={HomeStyles.menuGrid}>
          {[
            {
              icon: require('../../img/Home/aihistorytakingIcon.png'),
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