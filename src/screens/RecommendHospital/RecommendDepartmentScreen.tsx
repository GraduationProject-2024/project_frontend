import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import styles from '../../styles/RecommendHospital/RecommendDepartmentStyles';

const departments = [
  {title: '가정의학과', description: '건강증진, 예방, 만성질환 등'},
  {title: '내과', description: '감기, 소화기, 호흡기 등'},
  {title: '마취통증의학과', description: '근육통증, 만성통증 등'},
  {title: '비뇨의학과', description: '소변시 통증, 남성 질환 등'},
  {title: '산부인과', description: '피임상담, 여성질환 등'},
  {title: '성형외과', description: '피부관리, 화상, 상처 등'},
  {title: '소아청소년과', description: '소아호흡기, 소아소화기, 알레르기 등'},
  {title: '신경과', description: '두통, 어지럼증, 뇌졸중 등'},
  {title: '신경외과', description: '요통, 디스크, 신경질환 등'},
  {title: '안과', description: '눈 피로, 결막염, 다래끼 등'},
  {title: '영상의학과', description: '방사선 촬영, MRI, CT 등'},
  {title: '외과', description: '갑상선, 유방, 하지정맥류 등'},
  {title: '응급의학과', description: '심한 탈수, 골절 처치 등'},
  {title: '이비인후과', description: '비염, 이염, 편도염 등'},
  {title: '재활의학과', description: '신체 회복, 물리 치료, 만성통증 등'},
  {title: '정신건강의학과', description: '수면장애, 스트레스, 중독 등'},
  {title: '정형외과', description: '관절염, 골반, 척추 통증 등'},
  {title: '치의학', description: '치아치료, 외과질환, 턱관절 등'},
  {title: '피부과', description: '두드러기, 가려움증, 여드름 등'},
  {title: '한의학', description: '한의원 진료, 다이어트, 침술 등'},
];

const RecommendDepartmentScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {departments.map((department, index) => (
        <View key={index} style={styles.departmentContainer}>
          <Text style={styles.title}>{department.title}</Text>
          <Text style={styles.description}>{department.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default RecommendDepartmentScreen;
