import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '../forms/Button';

type Props = {
  href: string
  text: string
};

export function SidebarItem({ href, text }: Props) {
  const { pathname } = useRouter();

  return (
    <Link href={href} passHref={true}>
      <StyledItem as="a" text={text} palette={['grey-500', pathname === href ? 'yellow-100' : 'grey-0']}/>
    </Link>
  );
}

const StyledItem = styled(Button)`
  margin-bottom: 2rem;
  text-align: start;
`;
