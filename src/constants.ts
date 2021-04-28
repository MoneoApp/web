import { Error } from '../shared/constants';

import { Breakpoint, Color, Shade } from './types';

export const breakpoints: Record<Breakpoint, number> = {
  phone: 0,
  tabletPortrait: 37.5,
  tabletLandscape: 56.25,
  laptop: 75,
  desktop: 93.75
};

export const colors: Record<Color, Partial<Record<Shade, [string, string]>>> = {
  gray: {
    0: ['#ffffff', '#1f1f1f'],
    100: ['#efefef', '#303030'],
    200: ['#d4d4d4', '#404040'],
    300: ['#9a9a9a', '#5f5f5f'],
    400: ['#707070', '#929292'],
    500: ['#454545', '#efefef']
  },
  yellow: {
    100: ['#fdecbe', '#906f18'],
    200: ['#ffba05', '#ffba05'],
    300: ['#d89b00', '#ffdd82']
  },
  green: {
    100: ['#9eddc2', '#167b4f'],
    200: ['#27b376', '#27b376'],
    300: ['#167b4f', '#9eddc2']
  },
  red: {
    100: ['#faa7ae', '#bf212f'],
    200: ['#e5414f', '#e5414f'],
    300: ['#bf212f', '#faa7ae']
  }
};

export const messages: Record<Error, string> = {
  [Error.Unknown]: 'Oops, er is iets mis gegaan',
  [Error.Unauthorized]: 'Je mag deze actie niet uitvoeren',
  [Error.BadUserInput]: 'De ingevulde gegevens zijn ongeldig'
};

export const errors: Record<string, string> = {
  email: 'Ongeldig e-mailadres',
  password: 'Ongeldig wachtwoord',
  invalidCredentials: 'Ongeldige inloggegevens',
  emailInUse: 'E-mailadres al in gebruik'
};

export const roles: Record<string, string> = {
  USER: 'Gebruiker',
  ADMIN: 'Beheerder'
};
