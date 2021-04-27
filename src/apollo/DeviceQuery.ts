/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeviceQuery
// ====================================================

export interface DeviceQuery_device {
  __typename: 'Device';
  id: string;
  model: string;
  brand: string;
}

export interface DeviceQuery {
  device: DeviceQuery_device | null;
}

export interface DeviceQueryVariables {
  id: string;
}
