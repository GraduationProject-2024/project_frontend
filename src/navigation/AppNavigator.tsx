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
            title: '병원 진료과 선택',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
