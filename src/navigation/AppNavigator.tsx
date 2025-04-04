import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import SignupScreen from '../screens/Signup/SignupScreen';
import ChooseLanguageScreen from '../screens/ChooseLanguage/ChooseLanguageScreen';
import MedicalInformationScreen from '../screens/MedicalInformation/MedicalInformationScreen';
import IntegratedMedicalScreen from '../screens/MedicalInformation/IntegratedMedicalScreen';
import PastMedicalHistoryScreen from '../screens/MedicalInformation/PastMedicalHistoryScreen';
import FamilyMedicalHistoryScreen from '../screens/MedicalInformation/FamilyMedicalHistoryScreen';
import MedicineInformationScreen from '../screens/MedicalInformation/MedicineInformationScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RecommendDepartmentScreen from '../screens/RecommendHospital/RecommendDepartmentScreen';
import RecommendHospitalListScreen from '../screens/RecommendHospital/RecommendHospitalListScreen';
import RecommendPharmacyListScreen from '../screens/RecommendPharmacy/RecommendPharmacyListScreen';
import CurrentConditionScreen from '../screens/RecommendEmergency/CurrentConditionScreen';
import RecommendEmergencyListScreen from '../screens/RecommendEmergency/RecommendEmergencyListScreen';
import TranslateLanguageScreen from '../screens/TranslateLanguage/TranslateLanguageScreen';
import RecordAndTranslateScreen from '../screens/RecordAndTranslate/RecordAndTranslateScreen';
import RescueTextScreen from '../screens/RescueText/RescueTextScreen';
import ChooseMainBodyScreen from '../screens/AIHistoryTaking/ChooseMainBodyScreen';
import ChooseDetailBodyScreen from '../screens/AIHistoryTaking/ChooseDetailBodyScreen';
import ChooseDetailSymptomScreen from '../screens/AIHistoryTaking/ChooseDetailSymptomScreen';
import SymptomOnsetTimeScreen from '../screens/AIHistoryTaking/SymptomOnsetTimeScreen';
import PainIntensityScreen from '../screens/AIHistoryTaking/PainIntensityScreen';
import PainDurationScreen from '../screens/AIHistoryTaking/PainDurationScreen';
import AdditionalInformationScreen from '../screens/AIHistoryTaking/AdditionalInformationScreen';
import AIHistoryTakingReportScreen from '../screens/AIHistoryTaking/AIHistoryTakingReportScreen';
import MyInformationScreen from '../screens/MyInformation/MyInformationScreen';

import BackIcon from '../img/Header/BackIcon.png';
import CloseIcon from '../img/Header/CloseIcon.png';

const Stack = createStackNavigator();

const BackButton = () => (
  <Image source={BackIcon} style={{width: 30, height: 30}} />
);

const CloseButton = ({navigation}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Home')}
    style={{marginRight: 20}}>
    <Image
      source={CloseIcon}
      style={{width: 35, height: 35}}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const AppNavigator = () => {
  const {t} = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={({navigation}) => ({
          headerStyle: {
            backgroundColor: '#FFFFFF',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#333',
          headerBackImage: BackButton,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#333',
          },
          headerRight: () => <CloseButton navigation={navigation} />,
        })}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ChooseLanguage"
          component={ChooseLanguageScreen}
          options={{title: t('언어 선택')}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{title: t('회원 가입')}}
        />
        <Stack.Screen
          name="MedicalInformation"
          component={MedicalInformationScreen}
          options={{title: t('기본 정보')}}
        />
        <Stack.Screen
          name="IntegratedMedical"
          component={IntegratedMedicalScreen}
          options={{title: t('건강 정보')}}
        />
        <Stack.Screen
          name="PastMedicalHistory"
          component={PastMedicalHistoryScreen}
          options={{title: t('과거 병력')}}
        />
        <Stack.Screen
          name="FamilyMedicalHistory"
          component={FamilyMedicalHistoryScreen}
          options={{title: t('가족력')}}
        />
        <Stack.Screen
          name="MedicineInformation"
          component={MedicineInformationScreen}
          options={{title: t('복용하는 약')}}
        />
        <Stack.Screen
          name="ChooseMainBody"
          component={ChooseMainBodyScreen}
          options={{title: t('주요 신체 부위 선택')}}
        />
        <Stack.Screen
          name="ChooseDetailBody"
          component={ChooseDetailBodyScreen}
          options={{title: t('세부 신체 부위 선택')}}
        />
        <Stack.Screen
          name="ChooseDetailSymptom"
          component={ChooseDetailSymptomScreen}
          options={{title: t('상세 증상 선택')}}
        />
        <Stack.Screen
          name="SymptomOnsetTime"
          component={SymptomOnsetTimeScreen}
          options={{title: t('증상 발생 시기')}}
        />
        <Stack.Screen
          name="PainIntensity"
          component={PainIntensityScreen}
          options={{title: t('통증의 강도')}}
        />
        <Stack.Screen
          name="PainDuration"
          component={PainDurationScreen}
          options={{title: t('통증의 지속시간')}}
        />
        <Stack.Screen
          name="AdditionalInformation"
          component={AdditionalInformationScreen}
          options={{title: t('추가 사항')}}
        />
        <Stack.Screen
          name="AIHistoryTakingReport"
          component={AIHistoryTakingReportScreen}
          options={{title: t('AI 사전 문진 결과')}}
        />
        <Stack.Screen
          name="RecommendDepartment"
          component={RecommendDepartmentScreen}
          options={{title: t('병원 진료과 선택')}}
        />
        <Stack.Screen
          name="RecommendHospitalList"
          component={RecommendHospitalListScreen}
          options={{title: t('병원 추천')}}
        />
        <Stack.Screen
          name="RecommendPharmacyList"
          component={RecommendPharmacyListScreen}
          options={{title: t('약국 추천')}}
        />
        <Stack.Screen
          name="CurrentCondition"
          component={CurrentConditionScreen}
          options={{title: t('현재 상태')}}
        />
        <Stack.Screen
          name="RecommendEmergencyList"
          component={RecommendEmergencyListScreen}
          options={{title: t('응급실 추천')}}
        />
        <Stack.Screen
          name="TranslateLanguage"
          component={TranslateLanguageScreen}
          options={{title: t('언어 변환')}}
        />
        <Stack.Screen
          name="RecordAndTranslate"
          component={RecordAndTranslateScreen}
          options={{title: t('녹음 및 번역')}}
        />
        <Stack.Screen
          name="RescueText"
          component={RescueTextScreen}
          options={{title: t('119 신고')}}
        />
        <Stack.Screen
          name="MyInformation"
          component={MyInformationScreen}
          options={{title: t('개인 정보')}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
