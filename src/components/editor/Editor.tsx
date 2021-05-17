import styled from '@emotion/styled';
import Konva from 'konva';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';

import { InteractionType } from '../../constants';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { ShapeConfig } from '../../types';
import { getPointerPosition } from '../../utils/getPointerPosition';

import { Shape } from './Shape';

type Props = {
  image: string
};

function EditorInternal({ image }: Props) {
  const [src] = useImage(image);
  const [ref, rect] = useResizeObserver();
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [selected, setSelected] = useState<string>();

  const isBackground = (e: Konva.KonvaEventObject<any>) => e.target === e.target.getStage() || e.target.getLayer()?.name() === 'background';

  return (
    <StyledWrapper ref={ref}>
      {rect && (
        <Stage
          width={rect.width}
          height={rect.height}
          draggable={true}
          onClick={(e) => isBackground(e) && setSelected(undefined)}
          onDblClick={(e) => {
            const pos = getPointerPosition(e.target);

            if (!pos || !isBackground(e)) {
              return;
            }

            const type = InteractionType.SQUARE;

            setShapes([...shapes, {
              id: `${type}-${Date.now()}`,
              type,
              x: pos.x,
              y: pos.y,
              width: 32,
              height: 32,
              rotation: 0
            }]);
          }}
          onWheel={(e) => {
            const stage = e.target.getStage();
            const oldScale = stage?.scaleX();
            const pointer = stage?.getPointerPosition();

            if (!stage || !oldScale || !pointer) {
              return;
            }

            const scaleBy = 1.05;
            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale
            };

            stage.scale({
              x: newScale,
              y: newScale
            });
            stage.position({
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale
            });
            stage.batchDraw();
          }}
        >
          <Layer name="background">
            <Image image={src}/>
          </Layer>
          <Layer>
            {shapes.map((config) => {
              const setConfig = (c: ShapeConfig) => setShapes(shapes.map((cc) => c.id === cc.id ? c : cc));

              return (
                <Shape
                  key={config.id}
                  config={config}
                  setConfig={setConfig}
                  selected={selected === config.id}
                  setSelected={() => setSelected(config.id)}
                />
              );
            })}
          </Layer>
        </Stage>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  height: 32rem;
  background-color: var(--gray-100);
`;

export const Editor = dynamic(() => Promise.resolve(EditorInternal), {
  ssr: false
});
