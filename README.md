# 🔍 Search Caching

<br />

> 원티드 프리온보딩 인턴십 3주차 개인 과제 <br>
> 한국임상정보 사이트의 검색 기능에 캐싱을 구현한 클론 코딩 사이트입니다.

<br />

<img width="1268" alt="image" src="https://github.com/mihyunLee/search-caching/assets/51310674/e7e3e3b0-ec0f-4d97-8b2a-bcf63d5d09a6">

<br />
<br />

# 🚀 Getting Started

## 배포 링크

https://search-caching.vercel.app/

> 배포 링크가 되지 않는다면 아래의 순서대로 프로젝트를 실행시켜 주세요.

## 설치

```
$ git clone https://github.com/mihyunLee/search-caching.git
$ npm install
```

## 실행

```
# 서버 실행
$ npm run json-server

# 프로젝트 실행
$ npm start
```

<br />

# ✅ 과제 요구사항

- 필수 요구 사항

  - 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현

    - 검색어가 없을 시 “검색어 없음” 표출

  - API 호출별로 로컬 캐싱 구현

    - 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)

  - 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행

  - API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정

  - 키보드만으로 추천 검색어들로 이동 가능하도록 구현

- 선택 요구 사항
  - 로컬 캐싱 expire time을 구현

<br>

## 1. 질환명 검색시 검색어 추천 기능 구현

### Assignment 1. API 호출을 통해서 검색어 추천 기능 구현

- [x] 검색어가 없을 시 “검색어 없음” 표출
- [x] 추천 검색어가 5개 이상일 경우 스크롤을 통해 화면에 보여준다 (추가 기능)

<b>✨ 구현 방식</b>

> 기존에는 `json-server`를 통해 로컬로 REST API Mock Server 실행하여 사용하였지만, 프로젝트 실행에 있어 불편함이 있었습니다. <br>
> 따라서 `Vercel`을 통해 서버를 배포하여 해당 배포 URL을 환경 변수로 등록 후 사용하는 방식을 채택하였습니다. <br>
> 검색어 표출은 fetch 응답을 저장한 상태값(`recommendedWordList`)의 길이에 따라 메시지를 렌더링 합니다.

```javascript
return(
	{
		recommendedWordList.length > 0 ? (
			<ul>
				// .. 검색어 결과 렌더링
			</ul>
		) : (
			<Message>검색어 없음</Message>
		);
	}
)
```

<br>

### Assignment 2. API를 호출할 때 마다 콘솔 창을 통해 API 호출 확인

- [x] API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정

<b>✨ 구현 방식</b>

> API를 호출할 때마다 출력을 해주어야 한다'를 고민했을 때, **패칭 함수를 호출할 때마다** 콘솔에 출력을 하는 방식과 **Axios interceptor**를 사용하여 출력하는 방식을 생각해보았습니다. <br>
> 코드 호출 시점을 고민하지 않아도 된다는 점에서 interceptor를 사용하여 콘솔창에 메시지를 출력해주었습니다.

```javascript
// instance: Axios 인스턴스

instance.interceptors.request.use((config) => {
  console.info("calling api");
  return config;
});
```

### Assignment 3. API 호출별로 로컬 캐싱 구현

- [x] 캐싱 기능을 제공하는 라이브러리를 사용하지 않고 로컬 캐싱을 구현

<b>✨ 구현 방식</b>

> 캐싱은 브라우저의 Local Storage, Session Storage, Cache Storage, 혹은 리액트 상태로 구현해볼 수 있습니다. <br> `Local Storage`와 `Session Storage`의 경우 약 5MB로 용량이 제한되고, 특히나 Session Storage는 브라우저의 탭의 수명으로 범위가 한정적입니다. <br> 또한 리액트 상태 값으로 캐시를 관리하면 프로젝트 자체가 가지고 있는 메모리가 커지게 되는 단점이 있습니다.
> 따라서, 브라우저의 `Cache Storage`를 사용해서 프로젝트 외부 스토리지를 사용할 수 있고, Cache Storage의 경우 수백MB에서 수 GB 이상 메모리를 사용할 수 있기 때문에 **Cache Storage로 캐싱을 구현하였습니다.**

```javascript
// cache.js
export async function setCachedData(cacheName, url, response) {
  // 캐시 생성 및 열기
  const cacheStorage = await caches.open(cacheName);
  // 네트워크로부터의 응답을 저장
  await cacheStorage.put(url, new Response(JSON.stringify(response)));
}

export async function getCachedData(cacheName, url) {
  try {
    const cacheStorage = await caches.open(cacheName);
    // 캐시 검색
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return;
    }

    return await cachedResponse.json();
  } catch (error) {
    console.error("Error while getting data from cache:", error);
  }
}
```

```javascript
// Search.jsx
// ✅ 캐시 사용하기

const fetchData = useCallback(async (keyword) => {
  try {
    const cacheName = `cache_${keyword}`;
    const url = `${BASE_URL}${ENDPOINT.SICK}?q=${keyword}`;

    let cacheData = await getCachedData(cacheName, url);

    if (cacheData) {
      // 캐시에 데이터가 있을 경우 -> 캐시 데이터 저장
      setRecommendedWordList(cacheData);
    } else {
      // 캐시에 데이터가 없을 경우 -> API 응답 값 저장
      const response = await getRecommendedWord(keyword);

      await setCachedData(cacheName, url, response);

      setRecommendedWordList(response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, []);
```

<br>

## 2. API 호출 횟수를 줄이는 전략 수립 및 실행

### Assignment 4. 입력마다 API 호출하지 않도록 방식 구현

- [x] Debounce 기법을 사용하여 API 호출 횟수 감소

기본적인 검색 기능은 input의 입력 값이 변경될 때마다 API를 호출하게 됩니다. 따라서 ‘담낭’을 검색해야 하는 경우 ‘ㄷ’, ‘다’, ‘담’, ‘담ㄴ’, ‘담나’, ‘담낭’ 총 6회의 API가 호출됩니다.
모든 입력에 대해 API를 호출하게 되면 너무 많은 호출 비용이 발생하게 되므로, 이를 해결해야했습니다.

<b>✨ 구현 방식</b>

> API의 호출 횟수를 감소하기 위해서는 throttling과 debouncing 두 가지 기법을 생각해볼 수 있었습니다. <br> `debouncing 기법`은 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것으로 일정 시간 이후에 특정 함수를 호출할 수 있어 throttling보다는 적합한 방식이라고 판단하였습니다. <br>
> 따라서 일정 시간이 지난 후 마지막 호출에 검색 키워드를 저장하는 `useDebounce()` 커스텀 훅을 만들어 API 호출 횟수를 줄일 수 있었습니다.

```javascript
import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

```javascript
// debouncing을 적용하여 검색어를 저장하고, 이를 fetch 함수의 매개변수로 사용
const [searchWord, setSearchWord] = useState("");

const debouncedSearchWord = useDebounce(searchWord, 500);

useEffect(() => {
  if (debouncedSearchWord.trim()) {
    fetchData(debouncedSearchWord);
  }
}, [debouncedSearchWord, fetchData]);
```

<br>

## 3. 키보드 이벤트

### Assignment 5. 키보드만으로 추천 검색어들로 이동 가능하도록 구현

- [x] 키보드의 방향키로 추천 검색어들 사이를 이동 하도록 구현

<b>✨ 구현 방식</b>

> `keydown` 이벤트로 키보드의 방향키를 눌렀을 때 키워드 이동을 구현했습니다. focusedIndex 상태값을 통해 focusedIndex와 추천 검색어 아이템의 인덱스가 같을 경우, `ref.current.focus()`로 해당 아이템을 포커싱하여 강조하는 스타일링을 구현했습니다.

<br>

<b>🤔 트러블 슈팅</b>

> 문제 사항 1.
> 추천 검색어를 클릭했을 때 기존의 selectedIndex가 변경되지 않아 다음 포커스시 클릭한 요소의 다음이 아닌, 기존 요소 다음의 요소가 포커스 되는 문제가 발생했습니다.

추천 검색어 아이템을 클릭했을 때 click 이벤트를 추가하여 해당 요소의 인덱스로 focusedIndex를 변경하는 방식으로 문제를 해결했습니다. <br> foucedIndex를 변경하는 `setFocusedIndex()`를 onClick 이벤트에 바로 전달할 수도 있지만, 더 선언적인 코드를 지향하고자 `resetFocuedIndex()` 함수를 정의해서 핸들러로 전달했습니다.

```javascript
const resetFocusedIndex = (idx) => {
  setFocusedIndex(idx);
};

return (
  // ...
  <ul>
    {recommendedWordList.map((el, idx) => (
      <SearchResultItem
        key={el.sickCd}
        ref={focusedIndex === idx ? liRef : null}
        tabIndex={focusedIndex === idx ? 0 : -1}
        onClick={() => resetFocusedIndex(idx)}
        onKeyDown={onKeyDown}
      >
        {el.sickNm}
      </SearchResultItem>
    ))}
  </ul>
);
```

> 문제사항 2.
> 스크롤이 있을 경우 keydown 이벤트 핸들러를 등록했을 때 하단으로 인덱스 이동이 되는 것이 아닌 스크롤이 이동되어버리는 문제가 발생하였습니다.

이는 키보드 이벤트의 기본 동작이 스크롤 이동이 우선이기 때문에 발생한 현상입니다. 키보드 이벤트 함수에 `e.preventDefault()` 로 기본 동작을 막아주어 문제를 해결하였습니다.

```javascript
const handleKeyDown = (e) => {
  const lastIndex = recommendedWordList.length - 1;
  if (e.nativeEvent.isComposing) return;

  switch (e.key) {
    case "ArrowDown": {
      // 다음 아이템으로 이동
      e.preventDefault(); // ✨ 키보드 기본 동작 막아주기
      setFocusedIndex((prev) => (prev < lastIndex ? prev + 1 : 0));
      break;
    }
    case "ArrowUp": {
      // 이전 아이템으로 이동
      e.preventDefault(); // ✨ 키보드 기본 동작 막아주기
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : lastIndex));
      break;
    }
    default:
      break;
  }
};
```

> 문제사항 3.
> 검색 창에 한글을 입력한 후 키보드 이벤트로 추천 검색어로 이동할 경우, 이벤트가 두 번 호출되어 포커스가 첫 번째 추천 검색어가 아닌 두 번째 추천 검색어로 이동하는 문제가 발생하였습니다.

해당 문제는 크롬 브라우저에서 한글을 사용하는 경우에만 문제가 발생합니다.
한글의 경우 자음과 모음의 조합으로 만들어지는 문자여서,
글자가 조합중인지 조합이 끝난 상태인지를 알 수 없어 생기는 문제였습니다.
따라서 영어로 입력하면 키 이벤트가 중복으로 발생하지 않습니다.

이 문제는 [isComposing](https://w3c.github.io/uievents/#dom-keyboardevent-iscomposing)을 사용하여 해결할 수 있었습니다.

```javascript
const handleKeyDown = (e) => {
  // ...

  // isComposing이 true일 경우 함수를 종료하여 중복 키보드 이벤트 종료
  if (e.nativeEvent.isComposing) return;

  // ...
};
```

<br>

# 🤝 커밋 컨벤션

| 태그           | 설명 (한국어로만 작성하기)                                     |
| -------------- | -------------------------------------------------------------- |
| `✨ FEAT:`     | 새로운 기능 추가 (변수명 변경 포함)                            |
| `🐛 FIX:`      | 버그 해결                                                      |
| `💄 DESIGN:`   | CSS 등 사용자 UI 디자인 변경                                   |
| `🎨 STYLE:`    | 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우          |
| `♻️ REFACTOR:` | 프로덕션 코드 리팩토링                                         |
| `💬 COMMENT:`  | 필요한 주석 추가 및 변경                                       |
| `📝 DOCS:`     | 문서를 수정한 경우                                             |
| `⚙️ CHORE:`    | 빌드 테스크 업데이트, 패키지 매니저 설정(프로덕션 코드 변경 X) |
| `🔄️ RENAME:`  | 파일 혹은 폴더명을 수정하거나 옮기는 작업                      |
| `🚚 REMOVE:`   | 파일을 삭제하는 작업만 수행한 경우                             |
| `🎉 INIT:`     | 초기 커밋을 진행한 경우                                        |

<br>

# ⚙️ 기술 스택

<div style='display: flex'>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=square&logo=JavaScript&logoColor=black"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=square&logo=React&logoColor=white"/>
  <img src="https://img.shields.io/badge/Styled_Components-DB7093?style=square&logo=styled-components&logoColor=white"/>
  <img src="https://img.shields.io/badge/vercel-000000?style=square&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=square&logo=Netlify&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=square&logo=GitHub&logoColor=white"/>
  <img src="https://img.shields.io/badge/git-F05032?style=square&logo=git&logoColor=white">
</div>

