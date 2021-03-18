import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { withBreakpoint } from '../../utils/withBreakpoint';
import { Button } from '../forms/Button';

type Props = {
  href: string
  text: string
};

export function SidebarItem({ href, text }: Props) {
  const { pathname } = useRouter();

  return (
    <Link href={href} passHref={true}>
      <StyledItem as="a" text={text} palette={['grey-500', pathname === href ? 'yellow-100' : 'grey-0']}>
        <StyledText>
          {text}
        </StyledText>
        <StyledSmallText>
          {text[0]}
        </StyledSmallText>
      </StyledItem>
    </Link>
  );
}

const StyledItem = styled(Button)`
  margin-bottom: 1.5rem;
  text-align: start;

  ${withBreakpoint('laptop', css`
    margin-bottom: 2rem;
  `)};
`;

const StyledText = styled.span`
  display: none;

  ${withBreakpoint('laptop', css`
    display: inline;
  `)};
`;

const StyledSmallText = styled.span`
  ${withBreakpoint('laptop', css`
    display: none;
  `)};
`;
