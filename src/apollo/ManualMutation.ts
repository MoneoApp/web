/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertManualStep } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ManualMutation
// ====================================================

export interface ManualMutation_updateManual_steps {
  __typename: "ManualStep";
  id: string;
}

export interface ManualMutation_updateManual {
  __typename: "Manual";
  id: string;
  title: string;
  steps: ManualMutation_updateManual_steps[];
}

export interface ManualMutation {
  updateManual: ManualMutation_updateManual | null;
}

export interface ManualMutationVariables {
  id: string;
  title: string;
  steps: UpsertManualStep[];
}
