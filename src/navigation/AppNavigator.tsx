import React from 'react';
import {Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import SignupScreen from '../screens/Signup/SignupScreen';
import ChooseLanguageScreen from '../screens/ChooseLanguage/ChooseLanguageScreen';
import MedicalInformationScreen from '../screens/MedicalInformation/MedicalInformationScreen';
import PastMedicalHistoryScreen from '../screens/MedicalInformation/PastMedicalHistoryScreen';
import FamilyMedicalHistoryScreen from '../screens/MedicalInformation/FamilyMedicalHistoryScreen';
import MedicineInformationScreen from '../screens/MedicalInformation/MedicineInformationScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RecommendDepartmentScreen from '../screens/RecommendHospital/RecommendDepartmentScreen';
import RecommendHospitalListScreen from '../screens/RecommendHospital/RecommendHospitalListScreen';
import RecommendHospitalMapScreen from '../screens/RecommendHospital/RecommendHospitalMapScreen';
import RecommendPharmacyListScreen from '../screens/RecommendPharmacy/RecommendPharmacyListScreen';
import RecommendPharmacyMapScreen from '../screens/RecommendPharmacy/RecommendPharmacyMapScreen';
import RecommendEmergencyListScreen from '../screens/RecommendEmergency/RecommendEmergencyListScreen';
import RecommendEmergencyMapScreen from '../screens/RecommendEmergency/RecommendEmergencyMapScreen';
import TranslateLanguageScreen from '../screens/TranslateLanguage/TranslateLanguageScreen';
import RecordAndTranslateScreen from '../screens/RecordAndTranslate/RecordAndTranslateScreen';
import RescueTextScreen from '../screens/RescueText/RescueTextScreen';
import ChooseMainBodyScreen from '../screens/AIHistoryTaking/ChooseMainBodyScreen';
import ChooseDetailBodyScreen from '../screens/AIHistoryTaking/ChooseDetailBodyScreen';
import SymptomOnsetTimeScreen from '../screens/AIHistoryTaking/SymptomOnsetTimeScreen';
import PainIntensityScreen from '../screens/AIHistoryTaking/PainIntensityScreen';
import PainDurationScreen from '../screens/AIHistoryTaking/PainDurationScreen';
import AdditionalInformationScreen from '../screens/AIHistoryTaking/AdditionalInformationScreen';

import BackIcon from '../img/Header/BackIcon.png';

const Stack = createStackNavigator();

const BackButton = () => (
  <Image
    source={BackIcon}
    style={{width: 24, height: 24}}
    resizeMode="contain"
  />
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
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
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChooseLanguage"
          component={ChooseLanguageScreen}
          options={{
            title: '언어 선택',
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            title: '회원 가입',
          }}
        />
        <Stack.Screen
          name="MedicalInformation"
          component={MedicalInformationScreen}
          options={{
            title: '건강 정보',
          }}
        />
        <Stack.Screen
          name="PastMedicalHistory"
          component={PastMedicalHistoryScreen}
          options={{
            title: '과거 병력',
          }}
        />
        <Stack.Screen
          name="FamilyMedicalHistory"
          component={FamilyMedicalHistoryScreen}
          options={{
            title: '가족력',
          }}
        />
        <Stack.Screen
          name="MedicineInformation"
          component={MedicineInformationScreen}
          options={{
            title: '복용하는 약',
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChooseMainBody"
          component={ChooseMainBodyScreen}
          options={{
            title: '주요 신체 부위 선택',
          }}
        />
        <Stack.Screen
          name="ChooseDetailBody"
          component={ChooseDetailBodyScreen}
          options={{
            title: '세부 신체 부위 선택',
          }}
        />
        <Stack.Screen
          name="SymptomOnsetTime"
          component={SymptomOnsetTimeScreen}
          options={{
            title: '증상 발생 시기',
          }}
        />
        <Stack.Screen
          name="PainIntensity"
          component={PainIntensityScreen}
          options={{
            title: '통증의 강도',
          }}
        />
        <Stack.Screen
          name="PainDuration"
          component={PainDurationScreen}
          options={{
            title: '통증의 지속시간',
          }}
        />
        <Stack.Screen
          name="AdditionalInformation"
          component={AdditionalInformationScreen}
          options={{
            title: '추가 사항',
          }}
        />
        <Stack.Screen
          name="RecommendDepartment"
          component={RecommendDepartmentScreen}
          options={{
            title: '병원 진료과 선택',
          }}
        />
        <Stack.Screen
          name="RecommendHospitalList"
          component={RecommendHospitalListScreen}
          options={{
            title: '병원 추천 목록으로 보기',
          }}
        />
        <Stack.Screen
          name="RecommendHospitalMap"
          component={RecommendHospitalMapScreen}
          options={{
            title: '병원 추천 지도로 보기',
          }}
        />
        <Stack.Screen
          name="RecommendPharmacyList"
          component={RecommendPharmacyListScreen}
          options={{
            title: '약국 추천 목록으로 보기',
          }}
        />
        <Stack.Screen
          name="RecommendPharmacyMap"
          component={RecommendPharmacyMapScreen}
          options={{
            title: '약국 추천 지도로 보기',
          }}
        />
        <Stack.Screen
          name="RecommendEmergencyList"
          component={RecommendEmergencyListScreen}
          options={{
            title: '응급실 추천 목록으로 보기',
          }}
        />
        <Stack.Screen
          name="RecommendEmergencyMap"
          component={RecommendEmergencyMapScreen}
          options={{
            title: '응급실 추천 지도로 보기',
          }}
        />
        <Stack.Screen
          name="TranslateLanguage"
          component={TranslateLanguageScreen}
          options={{
            title: '언어 변환',
          }}
        />
        <Stack.Screen
          name="RecordAndTranslate"
          component={RecordAndTranslateScreen}
          options={{
            title: '녹음 및 번역',
          }}
        />
        <Stack.Screen
          name="RescueText"
          component={RescueTextScreen}
          options={{
            title: '119 문자 신고',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
