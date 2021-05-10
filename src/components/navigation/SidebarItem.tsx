import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { withBreakpoint } from '../../utils/withBreakpoint';
import { Button } from '../forms/Button';

type Props = {
  href: string
  text: string,
  icon: IconProp
};

export function SidebarItem({ href, text, icon }: Props) {
  const { pathname } = useRouter();

  return (
    <Link href={href} passHref={true}>
      <StyledItem as="a" text={text} palette={['gray-500', pathname === href ? 'yellow-100' : 'gray-0']}>
        <StyledIcon icon={icon} fixedWidth={true}/>
        <StyledText>
          {text}
        </StyledText>
      </StyledItem>
    </Link>
  );
}

const StyledItem = styled(Button)`
  justify-content: flex-start;
  margin-bottom: 1.5rem;

  ${withBreakpoint('laptop', css`
    margin-bottom: 2rem;
  `)};
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin: .5rem 0;

  ${withBreakpoint('laptop', css`
    margin: 0 .75rem 0 0;
  `)};
`;

const StyledText = styled.span`
  display: none;

  ${withBreakpoint('laptop', css`
    display: inline;
  `)};
`;
