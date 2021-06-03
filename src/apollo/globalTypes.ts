/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum DeviceType {
  DYNAMIC = "DYNAMIC",
  STATIC = "STATIC",
}

export enum InteractionType {
  ANCHOR = "ANCHOR",
  CIRCLE = "CIRCLE",
  SQUARE = "SQUARE",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface ManualStepInteraction {
  color: string;
  id: string;
}

export interface UpsertInteraction {
  height: number;
  id?: string | null;
  rotation: number;
  type: InteractionType;
  width: number;
  x: number;
  y: number;
}

export interface UpsertManualStep {
  interactions: ManualStepInteraction[];
  order: number;
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
