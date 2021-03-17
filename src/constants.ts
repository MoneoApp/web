import { Error } from '../shared/constants';

import { Breakpoint } from './types';

export const breakpoints: Record<Breakpoint, number> = {
  phone: 0,
  tabletPortrait: 37.5,
  tabletLandscape: 56.25,
  laptop: 75,
  desktop: 93.75
};

export const messages: Record<Error, string> = {
  [Error.Unknown]: 'Oops, er is iets mis gegaan',
  [Error.Unauthorized]: 'Je mag deze actie niet uitvoeren',
  [Error.BadUserInput]: 'De ingevulde gegevens zijn ongeldig'
};
