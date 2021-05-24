import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faLifeRing, faMobileAlt, faTachometerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

import { useAuthentication } from '../../states/authentication';
import { withBreakpoint } from '../../utils/withBreakpoint';
import { Container } from '../layout/Container';
import { Logo } from '../Logo';
import { Heading } from '../navigation/Heading';
import { SidebarItem } from '../navigation/SidebarItem';

type Props = {
  children?: ReactNode
};

const items = [{
  href: '/admin',
  text: 'Home',
  icon: faTachometerAlt
}, {
  href: '/admin/devices',
  text: 'Apparaten',
  icon: faMobileAlt
}, {
  href: '/admin/support',
  text: 'Ondersteuning',
  icon: faLifeRing
}, {
  href: '/admin/users',
  text: 'Gebruikers',
  icon: faUser,
  role: UserRole.ADMIN
}];

export function Sidebar({ children }: Props) {
  const { pathname } = useRouter();
  const [{ role }] = useAuthentication();
  const [actualRole, setRole] = useState<UserRole>(UserRole.USER);

  const current = items.find(({ href }) => pathname === href)?.text;

  useEffect(() => {
    if (role) {
      setRole(role);
    }
  }, [role, setRole]);

  return (
    <StyledContainer>
      <StyledSidebar>
        <StyledBrand>
          <StyledLogo/>
        </StyledBrand>
        {items.filter((i) => !i.role || i.role === actualRole).map(({ href, text, icon }) => (
          <SidebarItem key={href} href={href} text={text} icon={icon}/>
        ))}
      </StyledSidebar>
      <StyledMain>
        {current && (
          <Heading text={current}/>
        )}
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
