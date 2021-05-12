/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OverlayQuery
// ====================================================

export interface OverlayQuery_overlay {
  __typename: "Overlay";
  id: string;
  name: string;
}

export interface OverlayQuery {
  overlay: OverlayQuery_overlay | null;
}

export interface OverlayQueryVariables {
  id: string;
}
