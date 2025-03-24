import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/MyInformation/MyInformationStyles';

const MyInformationScreen = () => {
  const {t} = useTranslation();

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../img/Home/profileImage.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{t('메디코 테스트님')}</Text>
      </View>

      {/* 119 문자 신고 비밀번호 */}
      <Text style={styles.sectionTitle}>{t('119 문자 신고 비밀번호')}</Text>

      {/* 비밀번호 */}
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{t('비밀번호')}</Text>
        <Image
          source={require('../../img/Home/arrowRightIcon.png')}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>{t('계정 정보')}</Text>

      {[
        {label: '닉네임', value: '눈송이'},
        {label: '이메일', value: 'noonsong@sookmyung.kr'},
        {label: '전화 번호', value: '010-1234-5678'},
        {label: '본인 인증'},
        {label: '주소 인증'},
        {label: '언어 설정', value: '한국어'},
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Text style={styles.menuText}>{t(item.label)}</Text>
          <View style={styles.valueContainer}>
            {item.value && <Text style={styles.valueText}>{item.value}</Text>}
            <Image
              source={require('../../img/Home/arrowRightIcon.png')}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>{t('건강 정보')}</Text>

      {[
        {label: '키 · 몸무게 · 나이'},
        {label: '과거 병력 · 가족력 · 복용하는 약 · 알레르기'},
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Text style={styles.menuText}>{t(item.label)}</Text>
          <Image
            source={require('../../img/Home/arrowRightIcon.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MyInformationScreen;
