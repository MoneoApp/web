import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import Logo from '../../assets/logo.svg';
import { withBreakpoint } from '../../utils/withBreakpoint';
import { Container } from '../layout/Container';
import { SidebarItem } from '../navigation/SidebarItem';
import { useAuthentication } from '../../states/authentication';

type Props = {
  children?: ReactNode
};

const items = [{
  href: '/admin',
  text: 'Home'
}, {
  href: '/admin/devices',
  text: 'Apparaten'
}, {
  href: '/admin/support',
  text: 'Ondersteuning'
}, {
  href: '/admin/users',
  text: 'Gebruikers',
  role: UserRole.ADMIN
}];

export function Sidebar({ children }: Props) {
  const { pathname } = useRouter();

  const [{ role }] = useAuthentication();

  return (
    <StyledContainer>
      <StyledSidebar>
        <StyledBrand>
          <StyledLogo/>
        </StyledBrand>
        {items.filter((i) => !i.role || i.role === role).map(({ href, text }, i) => (
          <SidebarItem key={i} href={href} text={text}/>
        ))}
      </StyledSidebar>
      <StyledMain>
        <StyledHeading>
          {items.find(({ href }) => pathname === href)?.text ?? 'Onbekende pagina'}
        </StyledHeading>
        {children}
      </StyledMain>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  flex-direction: row;
`;

const StyledSidebar = styled.aside`
  flex: 0 0 2.75rem;
  display: flex;
  position: sticky;
  flex-direction: column;
  top: 0;
  height: 100vh;

  ${withBreakpoint('laptop', css`
    flex-basis: 12.5rem;
  `)};
`;

const StyledBrand = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  font-weight: bold;
  text-transform: uppercase;

  ${withBreakpoint('tabletLandscape', css`
    height: 7.5rem;
  `)};

  ${withBreakpoint('laptop', css`
    height: 10rem;

    &::after {
      content: "Moneo";
    }
  `)};
`;

const StyledLogo = styled(Logo)`
  width: 2rem;

  ${withBreakpoint('laptop', css`
    width: 3rem;
    margin-right: 1.5rem;
  `)};
`;

const StyledMain = styled.main`
  flex: 1;
  padding-left: 1.5rem;

  ${withBreakpoint('tabletLandscape', css`
    padding-left: 3rem;
  `)};
`;

const StyledHeading = styled.h1`
  display: flex;
  align-items: center;
  height: 5rem;
  font-size: 1.5rem;
  font-weight: bold;

  ${withBreakpoint('tabletLandscape', css`
    height: 7.5rem;
  `)};

  ${withBreakpoint('laptop', css`
    height: 10rem;
    font-size: 2rem;
  `)};
`;
