import Search from "./components/Search";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <GlobalStyle />
      <Search />
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default App;
