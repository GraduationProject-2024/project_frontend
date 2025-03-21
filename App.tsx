import React, {useState, useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n, {initializeI18n} from './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 저장소 불러오기 추가

console.log('RNRestart:', RNRestart);

const App = () => {
  const [isI18nLoaded, setIsI18nLoaded] = useState(false);

  useEffect(() => {
    const loadI18n = async () => {
      try {
        console.log('🔄 i18n 로딩 시작');
        await initializeI18n();
        console.log(`✅ i18n 로딩 완료, 현재 언어: ${i18n.language}`);
        setIsI18nLoaded(true);
      } catch (error) {
        console.error('❌ i18n 로딩 중 오류 발생:', error);
      }
    };

    loadI18n();

    const handleLanguageChange = async () => {
      console.log(`🌍 현재 앱 언어 변경됨: ${i18n.language}`);

      // ✅ 이전 언어와 비교하여 다를 때만 재시작
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang !== i18n.language) {
        console.log('🔥 앱을 재시작합니다.');
        await AsyncStorage.setItem('appLanguage', i18n.language); // ✅ 변경된 언어 저장
        setTimeout(() => RNRestart.restart(), 500);
      } else {
        console.log(
          'ℹ️ 언어 변경 감지됨, 하지만 동일한 언어이므로 재시작하지 않음.',
        );
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  console.log('🔄 isI18nLoaded 상태:', isI18nLoaded);

  if (!isI18nLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{flex: 1}}>
        <AppNavigator />
      </GestureHandlerRootView>
    </I18nextProvider>
  );
};

export default App;
