import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { withBreakpoint } from '../../utils/withBreakpoint';
import { Button } from '../forms/Button';
import { FieldForm } from '../forms/FieldForm';
import { Input } from '../forms/Input';
import { Column } from '../layout/Column';
import { Row } from '../layout/Row';

type Props = {
  text: string,
  icon: IconProp,
  href?: string,
  onClick?: () => void,
  setSearch: (search: string) => void
};

export function ListActions({ text, icon, href, onClick, setSearch }: Props) {
  const content = (
    <>
      <StyledButtonText>{text}</StyledButtonText>
      <FontAwesomeIcon icon={icon}/>
    </>
  );

  return (
    <Row spacing={{ phone: 1 }}>
      <Column sizes={{ phone: 9 }}>
        <FieldForm name="search" onChange={setSearch}>
          <Input name="search" label="Zoeken"/>
        </FieldForm>
      </Column>
      <Column sizes={{ phone: 3 }}>
        {href ? (
          <Link href={href} passHref={true}>
            <StyledButton as="a" text={text}>
              {content}
            </StyledButton>
          </Link>
        ) : (
          <StyledButton
            text={text}
            onClick={onClick}
          >
            {content}
          </StyledButton>
        )}
      </Column>
    </Row>
  );
}

const StyledButton = styled(Button)`
  height: calc(100% - 1rem);
`;

const StyledButtonText = styled.span`
  display: none;
  margin-right: .5rem;

  ${withBreakpoint('tabletLandscape', css`
    display: inline-block;
  `)};
`;
