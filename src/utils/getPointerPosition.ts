import Konva from 'konva';

export function getPointerPosition(node: Konva.Node) {
  const transform = node.getAbsoluteTransform().copy();

  transform.invert();

  const pos = node.getStage()?.getPointerPosition();

  if (!pos) {
    return;
  }

  return transform.point(pos);
}
