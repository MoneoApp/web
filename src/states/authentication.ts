import { createDakpan } from 'dakpan';

import { UserRole } from '../apollo/globalTypes';

type State = {
  token?: string,
  role?: UserRole
};

export const [AuthProvider, useAuthentication] = createDakpan<State>(() => {
  if (!process.browser) {
    return {};
  }

  const token = localStorage.getItem('token') || undefined;
  const role = localStorage.getItem('role') || undefined;

  if (role && !UserRole[role as UserRole]) {
    return {};
  }

  return {
    token,
    role: role as UserRole
  };
})({
  login: (token: string, role: UserRole) => () => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    return {
      token,
      role
    };
  },
  logout: () => () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    return {};
  }
});
