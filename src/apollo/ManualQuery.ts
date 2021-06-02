/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InteractionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: ManualQuery
// ====================================================

export interface ManualQuery_manual_steps_interactions {
  __typename: "Interaction";
  id: string;
  color: string | null;
}

export interface ManualQuery_manual_steps {
  __typename: "ManualStep";
  text: string;
  order: number;
  interactions: ManualQuery_manual_steps_interactions[];
}

export interface ManualQuery_manual_device_interactions {
  __typename: "Interaction";
  id: string;
  title: string;
  type: InteractionType;
}

export interface ManualQuery_manual_device {
  __typename: "Device";
  interactions: ManualQuery_manual_device_interactions[];
}

export interface ManualQuery_manual {
  __typename: "Manual";
  id: string;
  title: string;
  steps: ManualQuery_manual_steps[];
  device: ManualQuery_manual_device;
}

export interface ManualQuery {
  manual: ManualQuery_manual | null;
}

export interface ManualQueryVariables {
  id: string;
}
