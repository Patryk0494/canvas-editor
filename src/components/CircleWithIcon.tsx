import Konva from "konva";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { Group, Circle } from "react-konva";
import { useImage } from "react-konva-utils";

type CircleWithIconProps = CircleConfig & {
  groupRef: React.RefObject<Konva.Group>;
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
  radius = 12,
  ...circleProps
}) => {
  const [image, imageState] = useImage(fillPaternUrl || "");
  const patternImg = fillPatternImage || image;

  const imgWidth = patternImg?.width || 0;
  const imgHeight = patternImg?.height || 0;
  return (
    <Group x={x} y={y} ref={groupRef}>
      <Circle
        fill={fill}
        radius={radius}
        {...circleProps}
      />
      {patternImg && (
        <Circle
          fillPatternImage={patternImg}
          radius={radius}
          onClick={(mouseEvent) => onClick?.(mouseEvent)}
          fillPatternX={imgWidth / 2}
          fillPatternY={imgHeight / 2}
          fillPatternRepeat="repeat"
          {...circleProps}
        />
      )}
    </Group>
  );
};

export default CircleWithIcon;
