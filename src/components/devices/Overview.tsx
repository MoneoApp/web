import styled from '@emotion/styled';
import { Fragment, ReactNode, useMemo, useState } from 'react';

import { groupData } from '../../utils/groupData';
import { Row } from '../layout/Row';

import { Hideable } from './Hideable';

type Props<T> = {
  data: T[],
  keyBy: keyof T,
  groupBy: keyof T,
  children?: (value: T) => ReactNode
};

export function Overview<T>({ data, keyBy, groupBy, children }: Props<T>) {
  const groups = useMemo(() => groupData(data, groupBy), [data, groupBy]);
  const [open, setOpen] = useState<string>();

  return (
    <>
      {Object.entries(groups).map(([group, values]) => (
        <StyledValue key={group} open={open === group}>
          <StyledGroup onClick={() => setOpen(open === group ? undefined : group)}>
            {group}
          </StyledGroup>
          <Hideable hidden={open !== group}>
            <StyledItems>
              {values.map((value) => (
                <Fragment key={value[keyBy] as any}>
                  {children?.(value)}
                </Fragment>
              ))}
            </StyledItems>
          </Hideable>
        </StyledValue>
      ))}
    </>
  );
}

const StyledValue = styled.div<{ open: boolean }>`
  margin-bottom: ${(props) => props.open ? '1rem' : '0'};
  transition: margin-bottom .25s ease;
`;

const StyledGroup = styled.button`
  width: 100%;
  margin-bottom: 1rem;
  padding: .75rem 1rem;
  background-color: var(--gray-200);
  border-radius: 8px;
  font-weight: bold;
  text-align: start;
  outline: none;
  transition: box-shadow .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }
`;

const StyledItems = styled(Row)`
  margin-left: 1rem;
  padding: .5rem;
  background-color: var(--gray-200);
  border-radius: 16px;
`;
