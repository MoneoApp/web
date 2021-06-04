import styled from '@emotion/styled';
import Konva from 'konva';
import { ComponentType, createElement, useState } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { colors, shapes } from '../../constants';
import { InteractionConfig, ShapeConfig } from '../../types';
import { getRem } from '../../utils/getRem';

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

  const getRatio = (current: number, wanted: number) => {
    const max = wanted - getRem(5);
    const actual = Math.min(current, max);

    return 1 / current * actual;
  }

  const heightRatio = getRatio(image.height, innerHeight);
  const widthRatio = getRatio(image.width, innerWidth);
  const ratio = Math.min(heightRatio, widthRatio);

  return (
    <>
      <StyledStage
        width={image.width * ratio}
        height={image.height * ratio}
        scale={{ x: ratio, y: ratio }}
      >
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
                onClick={({ target }) => {
                  if (active) {
                    return remove(activeIndex);
                  }

                  const pointer = target.getStage()?.getPointerPosition();

                  if (!pointer) {
                    return;
                  }

                  add({ id: interaction.id, color: colors.yellow['200']![0] });
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
      </StyledStage>
      {picker && value[picker[0]] && (
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

const StyledStage = styled(Stage)`
  border-radius: 8px;
  overflow: hidden;
`;
