/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DevicesQuery
// ====================================================

export interface DevicesQuery_devices {
  __typename: 'Device';
  id: string;
  model: string;
  brand: string;
}

export interface DevicesQuery {
  devices: DevicesQuery_devices[];
}
