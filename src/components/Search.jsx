import React, { useCallback, useState } from "react";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import { styled } from "styled-components";
import { getRecommendedWord } from "../apis/requests";

export default function Search() {
  const [recommendedWordList, setRecommendedWordList] = useState([]);

  const fetchData = useCallback(async (keyowrd) => {
    try {
      const response = await getRecommendedWord(keyowrd);
      setRecommendedWordList(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <Container>
      <Title>
        국내 모든 임상시험 검색하고 <br /> 온라인으로 참여하기
      </Title>
      <SearchForm fetchData={fetchData} />
      <SearchResult recommendedWordList={recommendedWordList} />
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
