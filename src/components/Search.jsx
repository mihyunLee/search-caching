import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import { styled } from "styled-components";
import { getRecommendedWord } from "../apis/requests";
import useDebounce from "../hooks/useDebounce";

export default function Search() {
  const [searchWord, setSearchWord] = useState("");
  const [recommendedWordList, setRecommendedWordList] = useState([]);
  const debouncedSearchWord = useDebounce(searchWord, 300);

  const fetchData = async (keyowrd) => {
    try {
      const response = await getRecommendedWord(keyowrd);
      setRecommendedWordList(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeInput = (e) => {
    setSearchWord(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchWord) {
      fetchData(debouncedSearchWord);
    }
  }, [debouncedSearchWord]);

  console.log("컴포넌트 리렌더링");

  return (
    <Container>
      <Title>
        국내 모든 임상시험 검색하고 <br /> 온라인으로 참여하기
      </Title>
      <SearchForm
        searchWord={searchWord}
        handleChangeInput={handleChangeInput}
      />
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
