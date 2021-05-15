import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { InteractionType } from '../../constants';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { ShapeConfig } from '../../types';

import { Shape } from './Shape';

function EditorInternal() {
  const [ref, rect] = useResizeObserver();
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [selected, setSelected] = useState<string>();

  return (
    <StyledWrapper ref={ref}>
      {rect && (
        <Stage
          width={rect.width}
          height={rect.height}
          onClick={(e) => e.target === e.target.getStage() && setSelected(undefined)}
          onDblClick={({ target }) => {
            const stage = target.getStage();
            const pos = stage?.getPointerPosition();

            if (!pos || target !== stage) {
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
        >
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
  background-color: yellow;
`;

export const Editor = dynamic(() => Promise.resolve(EditorInternal), {
  ssr: false
});
