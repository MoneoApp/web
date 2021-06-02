import { DialoogProps } from 'dialoog';
import { useState } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';
import useImage from 'use-image';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { InteractionConfig } from '../../types';
import { getUploadUrl } from '../../utils/getUploadUrl';
import { Dialog } from '../Dialog';
import { DeviceInteractions } from '../manuals/DeviceInteractions';

type Props = {
  image: string,
  interactions: InteractionFragment[],
  initialValue: InteractionConfig[],
  control: UseFieldArrayReturn
};

export function SelectInteractions({ image, interactions, initialValue, control, ...props }: Props & DialoogProps) {
  const [data] = useImage(getUploadUrl(image));
  const [value, setValue] = useState(initialValue);

  return (
    <>
      {data && (
        <Dialog {...props}>
          <DeviceInteractions
            image={data}
            interactions={interactions}
            value={value}
            add={(v) => {
              control.append(v);
              setValue([...value, v]);
            }}
            remove={(index) => {
              control.remove(index);
              setValue(value.filter((_, i) => i !== index));
            }}
          />
        </Dialog>
      )}
    </>
  );
}
