import React, {useState, useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n, {initializeI18n} from './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isI18nLoaded, setIsI18nLoaded] = useState(false);

  useEffect(() => {
    const loadI18n = async () => {
      try {
        console.log('🔄 i18n 로딩 시작');
        await initializeI18n();
        console.log(`✅ i18n 로딩 완료, 현재 언어: ${i18n.language}`);
        setIsI18nLoaded(true); // ✅ 초기화 완료 후 상태 변경
      } catch (error) {
        console.error('❌ i18n 로딩 중 오류 발생:', error);
      }
    };

    loadI18n();

    const handleLanguageChange = () => {
      console.log(`🌍 현재 앱 언어 변경됨: ${i18n.language}`);
      setIsI18nLoaded(prev => !prev); // ✅ 강제 리렌더링
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  console.log('🔄 isI18nLoaded 상태:', isI18nLoaded); // ✅ 상태 확인 로그 추가

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
