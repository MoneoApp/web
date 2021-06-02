import { ComponentType, createElement } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { shapes } from '../../constants';
import { InteractionConfig, ShapeConfig } from '../../types';

type Props = {
  image: HTMLImageElement,
  interactions: InteractionFragment[],
  value: InteractionConfig[],
  add: (value: InteractionConfig) => void,
  remove: (index: number) => void
};

export function DeviceInteractions({ image, interactions, value, add, remove }: Props) {
  return (
    <Stage width={image.width} height={image.height}>
      <Layer>
        <Image image={image}/>
        {interactions.map((interaction) => {
          const activeIndex = value.findIndex(({ id }) => interaction.id === id);
          const active = value[activeIndex];

          return (
            <Group
              key={interaction.id}
              x={interaction.x}
              y={interaction.y}
              rotation={interaction.rotation}
              onDblClick={() => active ? remove(activeIndex) : add({ id: interaction.id, color: '#ffba05' })}
            >
              {createElement(shapes[interaction.type] as ComponentType<ShapeConfig>, {
                ...interaction,
                color: active?.color
              })}
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}
