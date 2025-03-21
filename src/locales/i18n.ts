import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import ko from './ko.json';
import vi from './vi.json';
import zhCN from './zh-cn.json';
import zhTW from './zh-tw.json';

// 🔥 i18n 인스턴스 생성
const resources = {
  en: {translation: en},
  ko: {translation: ko},
  vi: {translation: vi},
  'zh-cn': {translation: zhCN},
  'zh-tw': {translation: zhTW},
};

// 🔥 i18n 초기화
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // 기본 언어 설정
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {escapeValue: false},
  })
  .then(() => console.log('✅ i18n 초기화 완료!'))
  .catch(err => console.error('❌ i18n 초기화 중 오류 발생:', err));

export default i18n; // ✅ 반드시 default export 하기!
