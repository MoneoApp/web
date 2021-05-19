import styled from '@emotion/styled';
import { useDialoog } from 'dialoog';
import Konva from 'konva';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';

import { InteractionType } from '../../apollo/globalTypes';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { ShapeConfig } from '../../types';
import { getPointerPosition } from '../../utils/getPointerPosition';
import { ShapeSettings } from '../dialogs/ShapeSettings';
import { Button } from '../forms/Button';

import { Shape } from './Shape';
import { Toolbox } from './Toolbox';

type Props = {
  image: string
};

function EditorInternal({ image }: Props) {
  const [src] = useImage(image);
  const ref = useRef<Konva.Stage>(null);
  const [wrapperRef, rect] = useResizeObserver();
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [selected, setSelected] = useState<string>();
  const [, { open }] = useDialoog();

  const isBackground = (e: Konva.KonvaEventObject<any>) => e.target === e.target.getStage() || e.target.getLayer()?.name() === 'background';
  const openSettings = (config: ShapeConfig) => open.c((props) => (
    <ShapeSettings
      shape={config}
      onDelete={() => {
        setShapes(shapes.filter((s) => s.id !== config.id));
        props.close();
      }}
      onCreate={(data) => {
        props.close();
      }}
      {...props}
    />
  ), { strict: true });

  return (
    <StyledWrapper
      ref={wrapperRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();

        if (!ref.current) {
          return;
        }

        const stage = ref.current.getStage();

        stage.setPointersPositions(e);

        const pos = getPointerPosition(stage);

        if (!pos) {
          return;
        }

        const type = e.dataTransfer.getData('type') as InteractionType;
        const shape = {
          id: `${type}-${Date.now()}`,
          type,
          x: pos.x - 16,
          y: pos.y - 16,
          width: 32,
          height: 32,
          rotation: 0
        };

        setShapes([...shapes, shape]);
        openSettings(shape)();
      }}
    >
      {rect && (
        <Stage
          ref={ref}
          width={rect.width}
          height={rect.height}
          draggable={true}
          onClick={(e) => isBackground(e) && setSelected(undefined)}
          onWheel={(e) => {
            const stage = e.target.getStage();
            const oldScale = stage?.scaleX();
            const pointer = stage?.getPointerPosition();

            if (!stage || !oldScale || !pointer) {
              return;
            }

            const scaleBy = 1.05;
            const scrolledScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const newScale = Math.max(0.35, Math.min(scrolledScale, 2.5));
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
                  openSettings={openSettings(config)}
                />
              );
            })}
          </Layer>
        </Stage>
      )}
      <StyledOverlay>
        <Button text="Opslaan"/>
        <Toolbox/>
      </StyledOverlay>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  height: 32rem;
  background-color: var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
`;

const StyledOverlay = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 1rem;
  left: 1rem;
  gap: .5rem;
`;

export const Editor = dynamic(() => Promise.resolve(EditorInternal), {
  ssr: false
});
