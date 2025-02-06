import Konva from "konva";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { Group, Circle } from "react-konva";
import { useImage } from "react-konva-utils";

type CircleWithIconProps = CircleConfig & {
  groupRef?: React.RefObject<Konva.Group>;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
} & (
    | { fillPaternUrl: string; fillPatternImage?: never }
    | {
        fillPaternUrl?: never;
        fillPatternImage: CircleConfig["fillPatternImage"];
      }
  );

const CircleWithIcon: React.FC<CircleWithIconProps> = ({
  x,
  y,
  onClick,
  fill,
  fillPaternUrl,
  fillPatternImage,
  groupRef,
  onDragMove,
  radius = 12,
  ...circleProps
}) => {
  const [image] = useImage(fillPaternUrl || "");
  const patternImg = fillPatternImage || image;

  const imgWidth = patternImg?.width || 0;
  const imgHeight = patternImg?.height || 0;
  return (
    <Group
      x={x}
      y={y}
      ref={groupRef}
      onClick={(mouseEvent) => onClick?.(mouseEvent)}
    >
      <Circle fill={fill} radius={radius} {...circleProps} />
      {patternImg && (
        <Circle
          fillPatternImage={patternImg}
          radius={radius}
          fillPatternX={imgWidth / 2}
          fillPatternY={imgHeight / 2}
          fillPatternRepeat="repeat"
          onDragMove={onDragMove}
          {...circleProps}
        />
      )}
    </Group>
  );
};

export default CircleWithIcon;
