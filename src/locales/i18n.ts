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

/**
 * ✅ i18n 초기화 함수
 * 1️⃣ AsyncStorage에서 저장된 언어 가져오기
 * 2️⃣ 저장된 언어가 없으면 'ko' (기본값) 사용
 * 3️⃣ `i18n`을 설정하고 적용
 */
export const initializeI18n = async () => {
  try {
    console.log('🔄 i18n 초기화 시작');

    // ✅ AsyncStorage에서 저장된 언어 가져오기
    let savedLanguage = await AsyncStorage.getItem('appLanguage');
    console.log('📦 저장된 언어:', savedLanguage);

    // ✅ 저장된 언어가 없으면 기본값('ko') 사용
    const defaultLanguage = savedLanguage || 'ko';
    console.log('🌍 적용할 언어:', defaultLanguage);

    await i18n.use(initReactI18next).init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'ko', // ✅ 기본 언어를 'ko'로 설정하여, 번역이 없을 경우 한국어 사용
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
 * 1️⃣ `AsyncStorage`에 변경된 언어 저장
 * 2️⃣ `i18n.changeLanguage()`를 실행하여 언어 변경
 */
export const changeAppLanguage = async newLanguage => {
  try {
    console.log(`🌍 언어 변경 요청: ${newLanguage}`);

    // ✅ 현재 언어와 동일하면 변경하지 않음
    if (i18n.language === newLanguage) {
      console.log('ℹ️ 동일한 언어 선택됨, 변경하지 않음.');
      return;
    }

    // ✅ AsyncStorage에 변경된 언어 저장
    await AsyncStorage.setItem('appLanguage', newLanguage);

    // ✅ i18n의 언어 변경 적용
    await i18n.changeLanguage(newLanguage);
    console.log(`✅ 언어 변경 완료! 현재 언어: ${i18n.language}`);
  } catch (error) {
    console.error('❌ 언어 변경 오류:', error);
  }
};

export default i18n;
