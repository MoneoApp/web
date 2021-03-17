import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type Props = {
  href: string
  children?: ReactNode
};

export function NavigationItem({ href, children }: Props) {
  const { pathname } = useRouter();

  return (
    <Link href={href} passHref={true}>
      <StyledItem current={pathname === href}>{children}</StyledItem>
    </Link>
  );
}

const StyledItem = styled.a<{ current: boolean }>`
  margin-bottom: 2rem;
  padding: .5rem 1rem;
  color: var(--grey-500);
  background-color: ${(props) => props.current ? 'var(--yellow-100)' : 'transparent'};
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color .25s ease;
`;
