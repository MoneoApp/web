import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import Logo from '../../assets/logo.svg';
import { withBreakpoint } from '../../utils/withBreakpoint';
import { Container } from '../layout/Container';
import { NavigationItem } from '../navigation/NavigationItem';

type Props = {
  children?: ReactNode
};

const items = [{
  title: 'Home',
  href: '/admin'
}, {
  title: 'Apparaten',
  href: '/admin/devices'
}, {
  title: 'Ondersteuning',
  href: '/admin/support'
}];

export function Sidebar({ children }: Props) {
  const { pathname } = useRouter();

  return (
    <StyledContainer>
      <StyledSidebar>
        <StyledBrand>
          <StyledLogo/>
          Moneo
        </StyledBrand>
        {items.map(({ title, href }, i) => (
          <NavigationItem key={i} href={href}>
            {title}
          </NavigationItem>
        ))}
      </StyledSidebar>
      <StyledMain>
        <StyledHeading>
          {items.find(({ href }) => pathname === href)?.title ?? 'Onbekende pagina'}
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
  flex: 0 0 4rem;
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
  margin: 4rem 0;
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledLogo = styled(Logo)`
  width: 3rem;
  margin-right: 1.5rem;
`;

const StyledMain = styled.main`
  flex: 1;
  padding-left: 3rem;
`;

const StyledHeading = styled.h1`
  margin: 4rem 0;
  font-size: 2rem;
  font-weight: bold;
`;
