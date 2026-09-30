# Android 설치용 APK 빌드

## 1. 준비
- Node.js 설치
- Expo 계정 준비

## 2. 프로젝트 실행
```bash
cd native-app
npm install
npx expo start
```

## 3. APK 빌드
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

빌드가 끝나면 Expo가 설치용 APK 링크를 제공합니다.

## 스토어용 Android
```bash
eas build --platform android --profile production
```

## iOS
```bash
eas build --platform ios
```

> iOS 실제 기기/스토어 배포에는 Apple Developer 계정과 서명 절차가 필요합니다.
