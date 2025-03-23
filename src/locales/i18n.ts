import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import ko from './ko.json';
import vi from './vi.json';
import zhCN from './zhCN.json';
import zhTW from './zhTW.json';

const resources = {
  en: {translation: en},
  ko: {translation: ko},
  vi: {translation: vi},
  zhCN: {translation: zhCN},
  zhTW: {translation: zhTW},
};

/**
 * ✅ i18n 초기화 함수
 */
export const initializeI18n = async () => {
  try {
    console.log('🔄 i18n 초기화 시작');

    let savedLanguage = await AsyncStorage.getItem('appLanguage');
    console.log('📦 저장된 언어:', savedLanguage);

    // ✅ 저장된 언어가 없으면 기본값('en') 사용
    const defaultLanguage = savedLanguage || 'ko';
    console.log('🌍 적용할 언어:', defaultLanguage);

    console.log('📝 JSON 데이터 확인:', {
      zhCN,
      zhTW,
    });

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

/**
 * ✅ 언어 변경 함수
 */
export const changeAppLanguage = async newLanguage => {
  try {
    console.log(`🌍 언어 변경 요청: ${newLanguage}`);

    if (i18n.language === newLanguage) {
      console.log('ℹ️ 동일한 언어 선택됨, 변경하지 않음.');
      return;
    }

    await AsyncStorage.setItem('appLanguage', newLanguage);

    await i18n.changeLanguage(newLanguage);
    console.log(`✅ 언어 변경 완료! 현재 언어: ${i18n.language}`);
  } catch (error) {
    console.error('❌ 언어 변경 오류:', error);
  }
};

export default i18n;
