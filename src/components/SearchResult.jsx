import React from "react";
import { styled } from "styled-components";

export default function SearchResult() {
  return (
    <Container>
      <Title>추천 검색어</Title>
    </Container>
  );
}

const Container = styled.div`
  width: 490px;
  height: 250px;
  position: absolute;
  bottom: -180px;
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
