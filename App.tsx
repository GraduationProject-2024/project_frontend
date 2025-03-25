import React, {useState, useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n, {initializeI18n} from './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [isI18nLoaded, setIsI18nLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        console.log('🔄 i18n 로딩 시작');
        await initializeI18n();

        const storedLang = await AsyncStorage.getItem('appLanguage');
        if (storedLang && storedLang !== i18n.language) {
          await i18n.changeLanguage(storedLang);
          console.log(`✅ 저장된 언어 적용 완료: ${storedLang}`);
        }

        console.log(`✅ i18n 로딩 완료, 현재 언어: ${i18n.language}`);
        setIsI18nLoaded(true);
      } catch (error) {
        console.error('❌ i18n 로딩 중 오류 발생:', error);
      }
    };

    loadLanguage();
  }, []);

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
