import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import ko from './ko.json';
import vi from './vi.json';
import zhCN from './zh-cn.json';
import zhTW from './zh-tw.json';

const resources = {
  en: {translation: en},
  ko: {translation: ko},
  vi: {translation: vi},
  'zh-cn': {translation: zhCN},
  'zh-tw': {translation: zhTW},
};

export const initializeI18n = async () => {
  try {
    console.log('🔄 i18n 초기화 시작');

    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    console.log('📦 저장된 언어:', savedLanguage);

    const defaultLanguage = savedLanguage || 'ko';
    console.log('🌍 적용할 언어:', defaultLanguage);

    await i18n.use(initReactI18next).init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {escapeValue: false},
      react: {useSuspense: false},
    });

    console.log(`✅ i18n 초기화 완료! 현재 언어: ${i18n.language}`);
  } catch (error) {
    console.error('❌ i18n 초기화 오류:', error);
  }
};

export default i18n;
