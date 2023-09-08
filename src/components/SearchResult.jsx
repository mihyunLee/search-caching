import React, { useLayoutEffect, useRef } from "react";
import { styled } from "styled-components";
import SearchResultItem from "./SearchResultItem";

export default function SearchResult({
  recommendedWordList,
  focusedIndex,
  setFocusedIndex,
  onKeyDown,
}) {
  const liRef = useRef(null);

  const resetFocusedIndex = (idx) => {
    setFocusedIndex(idx);
  };

  useLayoutEffect(() => {
    if (liRef.current) {
      liRef.current.focus();
    }
  });

  return (
    <Container>
      <Title>추천 검색어</Title>
      <ResultBox>
        {recommendedWordList.length > 0 ? (
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
        ) : (
          <Message>검색어 없음</Message>
        )}
      </ResultBox>
    </Container>
  );
}

const Container = styled.div`
  width: 490px;
  max-height: 250px;
  position: absolute;
  top: 360px;
  padding: 18px;
  background-color: var(--white);
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const Title = styled.h3`
  font-size: 12px;
  font-weight: normal;
  color: var(--deepGray);
`;

const ResultBox = styled.div`
  max-height: 160px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--blue);
    border-radius: 50px;
    border: 4px solid var(--blue);
    min-height: 50px;
  }
`;

const Message = styled.p`
  color: var(--deepGray);
  text-align: center;
`;
