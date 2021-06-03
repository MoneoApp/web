import styled from '@emotion/styled';
import Konva from 'konva';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';

import { DeviceType, InteractionType } from '../../apollo/globalTypes';
import { useFileUrl } from '../../hooks/useFileUrl';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { ShapeConfig } from '../../types';
import { getPointerPosition } from '../../utils/getPointerPosition';

import { Shape } from './Shape';
import { Toolbox } from './Toolbox';

type Props = {
  name: string,
  image: string,
  imageOverride?: string,
  type: string,
  typeOverride?: DeviceType
};

function EditorInternal({ name, image, imageOverride, type, typeOverride }: Props) {
  const { watch, setValue } = useFormContext();

  const { [name]: initialData, [image]: imageData, [type]: typeData } = watch();
  const url = useFileUrl(imageData);

  const [src] = useImage(imageOverride ?? url ?? '');
  const ref = useRef<Konva.Stage>(null);
  const [wrapperRef, rect] = useResizeObserver();
  const [shapes, setShapes] = useState<ShapeConfig[]>(initialData ?? []);
  const [selected, setSelected] = useState<string>();

  const isBackground = (e: Konva.KonvaEventObject<any>) => e.target === e.target.getStage() || e.target.getLayer()?.name() === 'background';

  useEffect(() => {
    const data = typeOverride ?? typeData;

    if (!data) {
      return;
    } else if (data !== DeviceType.DYNAMIC) {
      return setShapes((s) => s.filter((shape) => shape.type !== InteractionType.ANCHOR));
    }

    setShapes((s) => s.find((shape) => shape.type === InteractionType.ANCHOR) ? s : [
      ...s,
      {
        id: `L${InteractionType.ANCHOR}-${Date.now()}`,
        type: InteractionType.ANCHOR,
        x: 32,
        y: 32,
        width: 128,
        height: 128,
        rotation: 0
      }
    ]);
  }, [typeData, typeOverride, setShapes]);

  useEffect(() => {
    setValue(name, shapes);
  }, [name, shapes, setValue]);

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

        const interactionType = e.dataTransfer.getData('type') as InteractionType;
        const shape = {
          id: `L${interactionType}-${Date.now()}`,
          type: interactionType,
          x: pos.x - 16,
          y: pos.y - 16,
          width: 32,
          height: 32,
          rotation: 0
        };

        setShapes([...shapes, shape]);
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
            e.evt.preventDefault();

            const stage = e.target.getStage();
            const oldScale = stage?.scaleX();
            const pointer = stage?.getPointerPosition();

            if (!stage || !oldScale || !pointer) {
              return;
            }

            const scaleBy = 1.05;
            const scrolledScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const newScale = Math.max(0.25, Math.min(scrolledScale, 2.5));
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
            {shapes.map((config) => (
              <Shape
                key={config.id}
                config={config}
                setConfig={(c) => setShapes(shapes.map((cc) => c.id === cc.id ? c : cc))}
                selected={selected === config.id}
                setSelected={() => setSelected(config.id)}
                deleteShape={() => setShapes((c) => c.filter((cc) => cc.id !== config.id))}
              />
            ))}
          </Layer>
        </Stage>
      )}
      <Toolbox/>
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

export const Editor = dynamic(() => Promise.resolve(EditorInternal), {
  ssr: false
});
