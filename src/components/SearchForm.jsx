import React from "react";
import { styled } from "styled-components";
import { ReactComponent as SearchIcon } from "../assets/icon-search.svg";

export default function SearchForm({ searchWord, handleChangeInput }) {
  return (
    <div>
      <form>
        <SearchBox>
          <SearchIcon width="16px" height="16px" />
          <StyledInput
            type="search"
            value={searchWord}
            onChange={handleChangeInput}
            placeholder="질환명을 입력해 주세요."
          />
          <SearchButton aria-label="검색">
            <SearchIcon width="21px" height="21px" />
          </SearchButton>
        </SearchBox>
      </form>
    </div>
  );
}

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 490px;
  background-color: var(--white);
  padding: 20px 10px 20px 24px;
  border-radius: 42px;

  svg {
    margin-right: 12px;

    path {
      fill: var(--gray);
    }
  }
`;

const StyledInput = styled.input`
  flex: 1;
  caret-color: var(--blue);
  padding-right: 25px;
  background-color: var(--white);
  font-size: 18px;
  outline: 0;

  &::placeholder {
    font-family: inherit;
    color: var(--gray);
  }
`;

const SearchButton = styled.button`
  width: 48px;
  height: 48px;
  background-color: var(--blue);
  border-radius: 50%;

  svg {
    margin: 0;

    path {
      fill: var(--white);
    }
  }
`;
