import Konva from 'konva';
import { ComponentType, createElement, useState } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { shapes } from '../../constants';
import { InteractionConfig, ShapeConfig } from '../../types';

import { ColorPicker } from './ColorPicker';

type Props = {
  image: HTMLImageElement,
  interactions: InteractionFragment[],
  value: InteractionConfig[],
  add: (value: InteractionConfig) => void,
  update: (index: number, value: InteractionConfig) => void,
  remove: (index: number) => void
};

export function DeviceInteractions({ image, interactions, value, add, update, remove }: Props) {
  const [picker, setPicker] = useState<[number, Konva.Vector2d]>();

  return (
    <>
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
                onDblClick={({ target }) => {
                  if (active) {
                    return remove(activeIndex);
                  }

                  const pointer = target.getStage()?.getPointerPosition();

                  if (!pointer) {
                    return;
                  }

                  add({ id: interaction.id, color: '#ffba05' });
                  setPicker([value.length, { x: pointer.x, y: pointer.y }]);
                }}
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
      {picker && (
        <ColorPicker
          x={picker[1].x + 16}
          y={picker[1].y + 16}
          color={value[picker[0]].color}
          setColor={(color) => {
            const v = value[picker[0]];

            update(picker[0], {
              ...v,
              color
            });
          }}
          onClose={() => setPicker(undefined)}
        />
      )}
    </>
  );
}
