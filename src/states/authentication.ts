import { createDakpan } from 'dakpan';

type State = {
  token?: string,
  role?: string
};

export const [AuthProvider, useAuthentication] = createDakpan<State>({
  token: process.browser ? localStorage.getItem('token') || undefined : undefined,
  role: process.browser ? localStorage.getItem('role') || undefined : undefined
})({
  login: (token: string, role: string) => () => {
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
