import { gql } from 'graphql-request';

/** Fetch ALL items from a board using cursor-based pagination (up to 500). */
export const GET_BOARD_ITEMS_PAGE = gql`
  query getBoardItemsPage($boardId: ID!, $cursor: String) {
    boards(ids: [$boardId]) {
      id
      name
      columns { id title type }
      items_page(limit: 100, cursor: $cursor) {
        cursor
        items {
          id
          name
          updated_at
          column_values {
            id
            text
            value
            type
            column { id title type }
          }
        }
      }
    }
  }
`;
