import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {I18nextProvider} from 'react-i18next'; // ✅ import 확인
import i18n from './src/locales/i18n'; // ✅ 올바르게 가져오는지 확인
import AppNavigator from './src/navigation/AppNavigator'; // ✅ AppNavigator 확인

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{flex: 1}}>
        <AppNavigator />
      </GestureHandlerRootView>
    </I18nextProvider>
  );
};

export default App;
