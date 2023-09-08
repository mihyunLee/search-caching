import React, { useCallback, useState } from "react";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import { styled } from "styled-components";
import { getRecommendedWord } from "../apis/requests";
import { BASE_URL, ENDPOINT } from "../constants";
import { getCachedData, setCachedData } from "../utils/cache";

export default function Search() {
  const [recommendedWordList, setRecommendedWordList] = useState([]);
  const [isEmptyValue, setIsEmptyValue] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e) => {
    const lastIndex = recommendedWordList.length - 1;
    if (e.nativeEvent.isComposing) return;

    switch (e.key) {
      case "ArrowDown": {
        // 다음 아이템으로 이동
        e.preventDefault();
        setFocusedIndex((prev) => (prev < lastIndex ? prev + 1 : 0));
        break;
      }
      case "ArrowUp": {
        // 이전 아이템으로 이동
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : lastIndex));
        break;
      }
      default:
        break;
    }
  };

  const fetchData = useCallback(async (keyword) => {
    try {
      const cacheName = `cache_${keyword}`;
      const url = `${BASE_URL}${ENDPOINT.SICK}?q=${keyword}`;

      let cacheData = await getCachedData(cacheName, url);

      if (cacheData) {
        // 캐시에 데이터가 있을 경우
        setRecommendedWordList(cacheData);
      } else {
        // 캐시에 데이터가 없을 경우
        const response = await getRecommendedWord(keyword);

        await setCachedData(cacheName, url, response);

        setRecommendedWordList(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <Container>
      <Title>
        국내 모든 임상시험 검색하고 <br /> 온라인으로 참여하기
      </Title>
      <SearchForm
        fetchData={fetchData}
        setIsEmptyValue={setIsEmptyValue}
        setFocusedIndex={setFocusedIndex}
        onKeyDown={handleKeyDown}
      />
      {!isEmptyValue && (
        <SearchResult
          recommendedWordList={recommendedWordList}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
          onKeyDown={handleKeyDown}
        />
      )}
    </Container>
  );
}
const Container = styled.article`
  position: relative;
  padding: 80px 0;
`;

const Title = styled.h2`
  font-size: 2.125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 42px;
`;
