import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// ES 모듈에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 대상 폴더 및 출력 파일 경로
const SCREENS_DIR = path.join(__dirname, '../screens');
const OUTPUT_FILE = path.join(__dirname, '../locales/ko.json');

// 🚀 한글 문장을 정확히 추출하는 정규식
const KOREAN_REGEX = /([\uAC00-\uD7A3]+(?:\s?[가-힣0-9,.!?()"'\-<>:{}[\]]+)*)/g;

// 📌 강화된 정규식 패턴 (더 많은 한글 탐지)
const JSX_TEXT_REGEX = /<Text[^>]*>(.*?)<\/Text>/gs; // <Text>한글</Text>
const JSX_EXPRESSION_REGEX = /<Text[^>]*>{["'`](.*?)["'`]}<\/Text>/gs; // <Text>{"한글"}</Text>
const ATTRIBUTE_REGEX =
  /(placeholder|title|label|buttonText|alt|hint|header|aria-label)=["'`](.*?)["'`]/g; // 속성에서 한글 추출
const FUNCTION_REGEX = /\b(?:alert|t|someFunc)\(["'`](.*?)["'`]\)/g; // alert("한글")
const GENERAL_FUNC_REGEX = /\b\w+\(["'`](.*?)["'`]\)/g; // someFunc("한글")

// 모든 파일을 읽어서 한글을 추출하는 함수
const extractKoreanText = dir => {
  let koreanTexts = new Set();

  const readFilesRecursively = directory => {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const fullPath = path.join(directory, file);
      console.log(`🔍 스캔 중: ${fullPath}`); // ✅ 파일 확인 로그 추가
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readFilesRecursively(fullPath);
      } else if (file.endsWith('.js') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // 1️⃣ 일반적인 한글 문장 추출
        const matches = content.match(KOREAN_REGEX);
        if (matches) {
          matches.forEach(match => {
            koreanTexts.add(match.trim());
          });
        }

        // 2️⃣ JSX 태그 내부의 텍스트 추출: <Text>한글</Text>
        const jsxTextMatches = content.match(JSX_TEXT_REGEX);
        if (jsxTextMatches) {
          jsxTextMatches.forEach(match => {
            const textContent = match.replace(/<\/?Text[^>]*>/g, '').trim();
            if (textContent.match(KOREAN_REGEX)) {
              koreanTexts.add(textContent);
            }
          });
        }

        // 3️⃣ JSX 태그 내부의 표현식 텍스트 추출: <Text>{"한글"}</Text>
        const jsxExpressionMatches = content.match(JSX_EXPRESSION_REGEX);
        if (jsxExpressionMatches) {
          jsxExpressionMatches.forEach(match => {
            const extractedText = match
              .replace(/<Text[^>]*>{["'`]?|["'`]?}<\/Text>/g, '')
              .trim();
            if (extractedText.match(KOREAN_REGEX)) {
              koreanTexts.add(extractedText);
            }
          });
        }

        // 4️⃣ 속성 값 추출: placeholder="한글", title="한글", label="한글"
        const attributeMatches = [...content.matchAll(ATTRIBUTE_REGEX)];
        attributeMatches.forEach(match => {
          const extractedText = match[2].trim();
          if (extractedText.match(KOREAN_REGEX)) {
            koreanTexts.add(extractedText);
          }
        });

        // 5️⃣ 함수 내부 한글 추출: alert("한글"), t("한글"), someFunc("한글")
        const functionMatches = [...content.matchAll(FUNCTION_REGEX)];
        functionMatches.forEach(match => {
          const extractedText = match[1].trim();
          if (extractedText.match(KOREAN_REGEX)) {
            koreanTexts.add(extractedText);
          }
        });

        // 6️⃣ 기타 함수 내부 한글: someOtherFunc("한글")
        const generalFuncMatches = [...content.matchAll(GENERAL_FUNC_REGEX)];
        generalFuncMatches.forEach(match => {
          const extractedText = match[1].trim();
          if (extractedText.match(KOREAN_REGEX)) {
            koreanTexts.add(extractedText);
          }
        });
      }
    });
  };

  readFilesRecursively(dir);
  return Array.from(koreanTexts);
};

// 한글을 JSON 파일로 저장하는 함수
const saveKoreanTextToJSON = () => {
  const koreanTexts = extractKoreanText(SCREENS_DIR);
  console.log(`✅ 총 ${koreanTexts.length}개의 한글 문자열이 추출됨!`); // ✅ 총 개수 출력
  const jsonData = {};

  koreanTexts.forEach(text => {
    jsonData[text] = text; // 한글 자체를 키로 사용
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`✅ 한글 문자열이 ${OUTPUT_FILE} 파일에 저장되었습니다!`);
};

// 실행
saveKoreanTextToJSON();
