import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isI18nLoaded, setIsI18nLoaded] = useState(false);

  useEffect(() => {
    console.log(`🌍 현재 앱 언어: ${i18n.language}`);

    if (!isI18nLoaded) {
      i18n
        .init()
        .then(() => {
          setIsI18nLoaded(true);
        })
        .catch(err => console.error('❌ i18n 초기화 오류:', err));
    }

    const languageChangedHandler = lng => {
      console.log(`🌍 언어 변경됨: ${lng}`);
    };

    i18n.on('languageChanged', languageChangedHandler);

    return () => {
      i18n.off('languageChanged', languageChangedHandler);
    };
  }, [isI18nLoaded]);

  if (!isI18nLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
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
