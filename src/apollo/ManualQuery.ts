/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ManualQuery
// ====================================================

export interface ManualQuery_manual {
  __typename: "Manual";
  id: string;
  title: string;
}

export interface ManualQuery {
  manual: ManualQuery_manual | null;
}

export interface ManualQueryVariables {
  id: string;
}
