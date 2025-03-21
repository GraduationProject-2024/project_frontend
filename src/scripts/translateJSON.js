import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// ✅ ES 모듈에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 .env 파일 로드
dotenv.config();

// 📌 Google Translate API 키를 .env에서 가져옴
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!API_KEY) {
  console.error('❌ ERROR: GOOGLE_TRANSLATE_API_KEY가 .env 파일에 없습니다!');
  process.exit(1);
}

const TRANSLATION_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

// 📌 번역할 언어 목록
const TARGET_LANGUAGES = {
  en: 'en', // 영어
  vi: 'vi', // 베트남어
  'zh-cn': 'zh-CN', // 중국어 간체
  'zh-tw': 'zh-TW', // 중국어 번체
};

// 📌 JSON 파일 경로 설정
const LOCALES_DIR = path.join(__dirname, '../locales');
const SOURCE_FILE = path.join(LOCALES_DIR, 'ko.json');

// 📌 JSON 파일 읽기 함수
const readJSON = filePath => {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// 📌 Google Translate API 호출 함수
const translateText = async (text, targetLang) => {
  try {
    const response = await fetch(TRANSLATION_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        q: text,
        target: targetLang,
      }),
    });

    const data = await response.json();
    if (data.data && data.data.translations) {
      return data.data.translations[0].translatedText;
    } else {
      console.error(`❌ 번역 실패: ${JSON.stringify(data)}`);
      return text; // 번역 실패 시 원본 반환
    }
  } catch (error) {
    console.error(`❌ API 호출 중 오류 발생: ${error}`);
    return text;
  }
};

// 📌 번역 실행 함수
const translateJSON = async () => {
  console.log('🚀 한글 JSON 파일을 번역 중...');
  const koData = readJSON(SOURCE_FILE);

  for (const [langKey, langCode] of Object.entries(TARGET_LANGUAGES)) {
    const outputFile = path.join(LOCALES_DIR, `${langKey}.json`);
    let translatedData = {};

    for (const [key, value] of Object.entries(koData)) {
      console.log(`🌍 [${langKey.toUpperCase()}] 번역 중: ${value}`);
      translatedData[key] = await translateText(value, langCode);
    }

    // 📌 번역된 데이터를 JSON 파일로 저장
    fs.writeFileSync(
      outputFile,
      JSON.stringify(translatedData, null, 2),
      'utf8',
    );
    console.log(`✅ ${langKey}.json 파일 저장 완료!`);
  }

  console.log('🎉 모든 번역이 완료되었습니다!');
};

// 📌 실행
translateJSON();
