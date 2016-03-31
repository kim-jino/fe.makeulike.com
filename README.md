# Makeulike Project Scaffold for Front-end Development
프로젝트 진행 시 Front-end 개발 환경을 동일하게 맞추고, 각종 Third-party Tool 들을 용이하게 사용하기 위한 Build Tool 입니다. Gulp 기반으로 진행하였으며, 프로젝트 수행 중 종종 실험적으로 해야 할 업무가 있어 Gulp 설정에 사용하지 않는 설정들이 다소 존재할 수 있습니다. ( 이 부분은 추후 정리 예정 입니다. )

## 개발환경 설정
아래 프로그램 설치 후 진행 (Windows / MacOS)

- git 설치 [https://git-scm.com/download/win](https://git-scm.com/download/win)
- node.js 설치 (NPM도 설치) [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## 설치방법
1. 콘솔 도구를 이용하여 `git clone https://github.com/makeulike/fe.scaffolding.git` 를 입력
2. 생성 된 fe.scaffolding 폴더로 진입 (경우에 따라 폴더명을 바꾸어도 됩니다. 단! [] 사이에 한글이 들어가면 안됩니다)
3. `npm install` 명령을 실행하여 Node.js Package 들을 설치
4. `bower install` 명령을 실행하여 패키지 관리자에 기본적으로 설정 되어있는 (bower.json 참조) 패키지들을 설치
5. [mui](http://github.com/makeulike/fe.mui) 설치진행 
	1. 현재 폴더내에서 `git clone http://github.com/makeulike/fe.mui` 를 입력
	2. fe.mui 폴더를 mui 폴더로 변경
6. `gulp develop` 명령 실행

## 사용방법 (명령어)
Scaffold 폴더는 fe.scaffolding 라고 가정

### 1) 개발
- fe.scaffolding/src 폴더를 기준으로 개발 시
```
> gulp develop
```

- fe.scaffolding/archive/name 폴더를 기준으로 개발 시
```
> gulp develop --product name
```

### 2) 빌드
- fe.scaffolding/src 폴더를 기준으로 빌드 시
```
> gulp build
```

- fe.scaffolding/archive/name 폴더를 기준으로 빌드 시
```
> gulp build --product name
```

### 3) JavaScript assets 소스코드 난독화
- fe.scaffolding/build/assets/js 및 fe.scaffolding/build/m/assets/js 폴더
```
> gulp uglify-js
```

## Appendix
Build 툴이 주로 사용하는 프로그램

- [bower](http://bower.io/)
- [gulp.js](http://gulpjs.com/)
- [npmjs](https://www.npmjs.com/)