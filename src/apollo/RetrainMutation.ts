/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RetrainMutation
// ====================================================

export interface RetrainMutation {
  /**
   * Start the retraining process of the model. This can take up to an hour. Will return false if already busy, otherwise true. Only accessible by roles: ADMIN.
   */
  retrain: boolean;
}
