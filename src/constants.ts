import { faCircle, faSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ComponentPropsWithoutRef, ComponentType } from 'react';
import { Transformer } from 'react-konva';

import { Error } from '../shared/constants';

import { InteractionType, UserType } from './apollo/globalTypes';
import { AnchorShape } from './components/editor/shapes/AnchorShape';
import { CircleShape } from './components/editor/shapes/CircleShape';
import { SquareShape } from './components/editor/shapes/SquareShape';
import { Breakpoint, Color, Shade, ShapeConfig } from './types';

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
  [Error.BadUserInput]: 'De ingevulde gegevens zijn ongeldig',
  [Error.InvalidInvite]: 'De uitnodiging is ongeldig',
  [Error.InvalidFileType]: 'Ongeldig bestandstype',
  [Error.InvalidInteractions]: 'Ongeldige interactiedata'
};

export const errors: Record<string, string> = {
  any: 'Ongeldige invoer',
  string: 'Ongeldige invoer',
  array: 'Ongeldige invoer',
  email: 'Ongeldig e-mailadres',
  password: 'Ongeldig wachtwoord',
  invalidCredentials: 'Ongeldige inloggegevens',
  emailInUse: 'E-mailadres al in gebruik'
};

export const userTypes: Record<UserType, string> = {
  USER: 'Gebruiker',
  CONTACT: 'Contactpersoon',
  ADMIN: 'Beheerder'
};

export const shapes: Record<InteractionType, ComponentType<ShapeConfig>> = {
  [InteractionType.SQUARE]: SquareShape,
  [InteractionType.CIRCLE]: CircleShape,
  [InteractionType.ANCHOR]: AnchorShape
};

export const transformSettings: Partial<Record<InteractionType, ComponentPropsWithoutRef<typeof Transformer>>> = {
  [InteractionType.ANCHOR]: {
    rotateEnabled: false,
    keepRatio: true,
    enabledAnchors: ['bottom-right']
  }
};

export const shapeIcons: Partial<Record<InteractionType, IconDefinition>> = {
  [InteractionType.SQUARE]: faSquare,
  [InteractionType.CIRCLE]: faCircle
};
