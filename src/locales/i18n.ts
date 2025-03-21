import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
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

// ✅ 초기화 코드 수정
const initI18n = async () => {
  try {
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'ko', // 기본 언어 설정
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {escapeValue: false},
    });

    console.log(`✅ i18n 초기화 완료! 현재 언어: ${i18n.language}`);
  } catch (error) {
    console.error('❌ i18n 초기화 오류:', error);
  }
};

// ✅ 비동기 실행
initI18n();

export default i18n;
