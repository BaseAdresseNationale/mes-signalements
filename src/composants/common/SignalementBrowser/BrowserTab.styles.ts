import styled from 'styled-components'

export const StyledBrowserTabWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 16%);
    padding: 5px 0;
  }

  .signalement-list {
    overflow-y: scroll;
    flex: 1;
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      padding: 10px;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: #f9f9f980;
        cursor: pointer;
      }

      p {
        margin: 2px 0;
      }
    }
  }
`
