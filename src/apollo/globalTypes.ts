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

export interface UpsertInteraction {
  description: string;
  height: number;
  id?: string | null;
  rotation: number;
  title: string;
  type: InteractionType;
  width: number;
  x: number;
  y: number;
}

export interface UpsertManualStep {
  interactionIds: string[];
  order: number;
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
