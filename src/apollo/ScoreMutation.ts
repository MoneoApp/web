/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertInteraction } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ScoreMutation
// ====================================================

export interface ScoreMutation {
  /**
   * Get the score of the specified anchor image. A score of at least 75 is recommended. Only accessible by roles: ADMIN, CONTACT, USER.
   */
  score: number;
}

export interface ScoreMutationVariables {
  image: any;
  interaction: UpsertInteraction;
}
