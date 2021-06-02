/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InteractionType } from "./globalTypes";

// ====================================================
// GraphQL fragment: InteractionFragment
// ====================================================

export interface InteractionFragment {
  __typename: "Interaction";
  id: string;
  type: InteractionType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
