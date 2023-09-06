import React from "react";
import { styled } from "styled-components";
import { StyledSearchIcon } from "./SearchForm";

function SearchResultItem({ children, tabIndex, onKeyDown }, ref) {
  return (
    <StyledLi ref={ref} tabIndex={tabIndex} onKeyDown={onKeyDown}>
      <StyledSearchIcon width="16px" height="16px" />
      <span>{children}</span>
    </StyledLi>
  );
}

const StyledLi = styled.li`
  display: flex;
  align-items: center;

  span {
    padding: 5px;
    flex: 1;
  }

  &:focus,
  &:focus-visible {
    outline: none;

    span {
      background-color: var(--lightGray);
      border-radius: 5px;
    }
  }
`;

export default React.forwardRef(SearchResultItem);
