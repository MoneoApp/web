import Konva from 'konva';
import React, { ComponentType, createElement, useEffect, useRef } from 'react';
import { Group, Transformer } from 'react-konva';

import { InteractionType } from '../../apollo/globalTypes';
import { colors, shapes, transformSettings } from '../../constants';
import { ShapeConfig } from '../../types';

type Props = {
  config: ShapeConfig,
  setConfig: (box: ShapeConfig) => void,
  selected: boolean,
  setSelected: () => void,
  deleteShape: () => void
};

export function Shape({ config, setConfig, selected, setSelected, deleteShape }: Props) {
  const ref = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (selected && ref.current && transformerRef.current) {
      transformerRef.current.moveToTop();
      transformerRef.current.nodes([ref.current]);
    }
  }, [selected]);

  return (
    <>
      <Group
        ref={ref}
        x={config.x}
        y={config.y}
        rotation={config.rotation}
        draggable={true}
        onMouseDown={setSelected}
        onTransform={({ target }) => {
          const stage = target.getStage();

          if (!stage) {
            return;
          }

          const { width, height } = target.getChildren()[0].size();
          const scale = target.scale();
          const position = target.position();

          const size = {
            width: width * scale.x,
            height: height * scale.y
          };

          target.scale({ x: 1, y: 1 });

          setConfig({
            ...config,
            ...position,
            ...size,
            rotation: target.rotation()
          });
        }}
        onDragMove={({ target }) => {
          const position = target.position();

          setConfig({
            ...config,
            ...position
          });
        }}
        onDblClick={() => config.type !== InteractionType.ANCHOR && deleteShape()}
      >
        {createElement(shapes[config.type] as ComponentType<ShapeConfig>, config)}
      </Group>
      {selected && (
        <Transformer
          ref={transformerRef}
          keepRatio={false}
          rotateAnchorOffset={32}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          enabledAnchors={['middle-right', 'bottom-right', 'bottom-center']}
          anchorStrokeWidth={0}
          borderStroke="#707070"
          ignoreStroke={true}
          anchorFill={colors.yellow['200']![0]}
          boundBoxFunc={(previous, next) => {
            const moved = previous.x !== next.x || previous.y !== next.y;
            const rotated = previous.rotation !== next.rotation;

            if (moved && !rotated) {
              return previous;
            }

            return {
              ...next,
              width: Math.max(16, next.width),
              height: Math.max(16, next.height)
            };
          }}
          rotateEnabled={false}
          {...transformSettings[config.type]}
        />
      )}
    </>
  );
}
