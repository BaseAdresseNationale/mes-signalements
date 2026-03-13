import styled from 'styled-components'

export const StyledBrowserTabWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
  }

  .signalement-list {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    list-style-type: none;
    padding: 0 0 39px 0;
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

  .pagination {
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #ccc;
  }
`
