/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertManualStep } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: NewManualMutation
// ====================================================

export interface NewManualMutation_createManual_steps {
  __typename: "ManualStep";
  id: string;
}

export interface NewManualMutation_createManual {
  __typename: "Manual";
  id: string;
  title: string;
  steps: NewManualMutation_createManual_steps[];
}

export interface NewManualMutation {
  createManual: NewManualMutation_createManual;
}

export interface NewManualMutationVariables {
  deviceId: string;
  title: string;
  steps: UpsertManualStep[];
}
