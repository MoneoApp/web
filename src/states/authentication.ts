import { createDakpan } from 'dakpan';

import { UserType } from '../apollo/globalTypes';

type State = {
  token?: string,
  type?: UserType
};

export const [AuthProvider, useAuthentication] = createDakpan<State>(() => {
  if (!process.browser) {
    return {};
  }

  const token = localStorage.getItem('token') || undefined;
  const type = localStorage.getItem('type') || undefined;

  if (!type || !UserType[type as UserType]) {
    return {};
  }

  return {
    token,
    type: type as UserType
  };
})({
  login: (token: string, type: UserType) => () => {
    localStorage.setItem('token', token);
    localStorage.setItem('type', type);

    return {
      token,
      type
    };
  },
  logout: () => () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');

    return {};
  }
});
