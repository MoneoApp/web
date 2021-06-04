import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';
import { useState } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';
import useImage from 'use-image';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { InteractionConfig } from '../../types';
import { getStaticAsset } from '../../utils/getStaticAsset';
import { Dialog } from '../Dialog';
import { DeviceInteractions } from '../manuals/DeviceInteractions';

type Props = {
  name: string,
  id: string,
  interactions: InteractionFragment[],
  initialValue: InteractionConfig[],
  control: UseFieldArrayReturn,
  update: (name: string, value: unknown) => void
};

export function SelectInteractions({ name, id, interactions, initialValue, control, update, ...props }: Props & DialoogProps) {
  const [data] = useImage(getStaticAsset(id, 'full'));
  const [value, setValue] = useState(initialValue);

  return (
    <>
      {data && (
        <StyledDialog {...props}>
          <DeviceInteractions
            image={data}
            interactions={interactions}
            value={value}
            add={(v) => {
              control.append(v);
              setValue([...value, v]);
            }}
            update={(index, v) => {
              update(`${name}.${index}`, v);
              setValue(value.map((_, i) => i === index ? v : _));
            }}
            remove={(index) => {
              control.remove(index);
              setValue(value.filter((_, i) => i !== index));
            }}
          />
        </StyledDialog>
      )}
    </>
  );
}

const StyledDialog = styled(Dialog)`
  overflow: visible;
`;
