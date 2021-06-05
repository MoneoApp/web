import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ReactNode } from 'react';

import { withBreakpoint } from '../../utils/withBreakpoint';

type Props<T> = {
  data: T[],
  keyBy: keyof T,
  href: (value: T) => string,
  columns: {
    [K in keyof T]?: {
      title: string,
      size?: string | number,
      render?: (value: T[K]) => ReactNode
    }
  }
};

export function Table<T>({ data, keyBy, href, columns }: Props<T>) {
  return (
    <>
      <StyledColumns>
        {Object.entries(columns).map((column, i) => {
          const { title, size } = column[1] as any;

          return (
            <StyledColumn key={column[0]} size={size} extra={i !== 0}>
              {title}
            </StyledColumn>
          );
        })}
      </StyledColumns>
      {data.map((value) => (
        <Link key={value[keyBy] as any} href={href(value)} passHref={true}>
          <StyledRow>
            {Object.entries(columns).map((column, i) => {
              const key = column[0] as keyof T;
              const { render, size } = column[1] as any;
              const entry = value[key];

              return (
                <StyledColumn key={key as any} size={size} extra={i !== 0}>
                  {render?.(entry) ?? entry}
                </StyledColumn>
              );
            })}
            <StyledIcon icon={faChevronRight} fixedWidth={true}/>
          </StyledRow>
        </Link>
      ))}
      {!data.length && (
        <StyledEmpty>
          Geen gegevens gevonden
        </StyledEmpty>
      )}
    </>
  );
}

const StyledColumns = styled.div`
  display: none;
  margin: 0 3rem 1rem 1rem;
  color: var(--gray-400);
  font-size: .9rem;
  font-weight: bold;
  text-transform: uppercase;

  ${withBreakpoint('tabletLandscape', css`
    display: flex;
  `)};
`;

const StyledColumn = styled.div<{ size?: string, extra: boolean }>`
  flex-grow: ${(props) => props.size ? 0 : 1};
  flex-basis: ${(props) => props.size ? props.size : 'auto'};
  overflow: hidden;

  ${(props) => props.extra && css`
    display: none;

    ${withBreakpoint('tabletLandscape', css`
      display: block;
    `)};
  `};
`;

const StyledRow = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: .75rem 1rem;
  color: var(--gray-500);
  background-color: var(--gray-200);
  border-radius: 8px;
  text-decoration: none;
  outline: none;
  transition: box-shadow .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-left: .75rem;
`;

const StyledEmpty = styled.div`
  margin: 0 1rem 1rem;
  color: var(--gray-400);
`;
