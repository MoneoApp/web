import { createDakpan } from 'dakpan';

type State = {
  token?: string
};

export const [AuthProvider, useAuthentication] = createDakpan<State>({
  token: process.browser ? localStorage.getItem('token') || undefined : undefined
})({
  login: (token: string) => () => {
    localStorage.setItem('token', token);

    return { token };
  },
  logout: () => () => {
    localStorage.removeItem('token');

    return {};
  }
});
