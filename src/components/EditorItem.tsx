import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Line, Rect, Circle, Transformer, Text } from "react-konva";

interface AnchorProps {
  x: number;
  y: number;
  onDragMove: (e: any) => void;
}

const Anchor: React.FC<AnchorProps> = ({ x, y, onDragMove }) => {
  return (
    <Circle
      x={x}
      y={y}
      radius={8}
      fill="purple"
      stroke="#666"
      strokeWidth={2}
      draggable
      onDragMove={onDragMove}
      onMouseEnter={() => (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
    />
  );
};

type CoordinateParams = { x: number; y: number; height: number; width: number };
const getCorners = ({ x, y, height, width }: CoordinateParams) => {
  const LT = { x, y };
  const LB = { x, y: y + height };
  const RT = { x: x + width, y };
  const RB = { x: x + width, y: y + height };
  return { LT, LB, RB, RT };
};

interface TextProps {
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  textContent?: string;
}

interface ImageProps {
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
}

export type EditorItemPropsType = TextProps | ImageProps;

const EditorItem = (props: EditorItemPropsType) => {
  const { x, y, width, height, type } = props;
  const isText = (props: EditorItemPropsType): props is TextProps =>
    props.type === "text";
  const childrenRef = useRef<Konva.Text | Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const polygonRef = useRef<Konva.Line>(null);
  const groupRef = useRef<Konva.Group>(null);
  const dragCircleRef = useRef<Konva.Circle>(null);
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [cornersPostion, setCornersPosition] = useState(
    getCorners({ ...position, ...size })
  );

  useEffect(() => {
    dragCircleRef.current?.setPosition({
      x: position.x + size.width,
      y: position.y,
    });
    getCorners({ ...position, ...size });
  }, [position, size]);
  const { LT, LB, RB, RT } = cornersPostion;
  const polygonCoords = [LT, LB, RB, RT].map(({ x, y }) => [x, y]).flat();

  const [anchorPos, setAnchorPos] = useState({ x: RB.x, y: RB.y });

  // const handleResize = (anchor: any) => {
  //   const anchorX = anchor.x();
  //   const anchorY = anchor.y();

  //   const newWidth = anchorX - position.x;
  //   const newHeight = anchorY - position.y;

  //   if (newWidth > 0 && newHeight > 0) {
  //     setSize({ width: newWidth, height: newHeight });
  //   }
  // };

  React.useEffect(() => {
    if (childrenRef?.current && trRef?.current) {
      trRef.current?.nodes([childrenRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [childrenRef.current]);
  console.log(childrenRef);
  return (
    <>
      <Group
        ref={groupRef}
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
      >
        {/* <Line
          points={polygonCoords}
          stroke="black"
          ref={polygonRef}
          strokeWidth={2}
          closed
        /> */}
        {isText(props) ? (
          <Text
            ref={childrenRef as React.RefObject<Konva.Text>}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            align="center"
            verticalAlign="middle"
            text={props.textContent}
          />
        ) : (
          <Rect
            ref={childrenRef as React.RefObject<Konva.Rect>}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            // fill="blue"
            // onDragMove={() => {
            //   setPoints(getBoundary(shapeRef.current!.getClientRect()));
            // }}
          />
        )}
        <Circle
          ref={dragCircleRef}
          x={RT.x}
          y={RT.y}
          radius={10}
          fill="green"
          onMouseEnter={() => groupRef?.current?.setDraggable(true)}
          onMouseLeave={() => groupRef?.current?.setDraggable(false)}
        />
        <Circle
          x={LT.x}
          y={LT.y}
          radius={10}
          fill="red"
          onClick={(mouseEvent) => mouseEvent.currentTarget?.parent?.destroy()}
        />
        {/* <Circle
        ref={scaleCircleRef}
        x={anchorPos.x}
        y={anchorPos.y}
        radius={10}
        fill="purple"
        draggable
        onDragMove={handleDragMove}
      /> */}
        {/* <Anchor
          // ref={scaleCircleRef}
          x={position.x + size.width}
          y={position.y + size.height}
          onDragMove={(e) => handleResize(e.target)}
        /> */}
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          borderStrokeWidth={2}
          borderStroke="#7209B7"
          anchorStroke="white" // Hide anchor points
          anchorFill="#7209B7"
          anchorCornerRadius={20}
          anchorStrokeWidth={0}
          anchorSize={20}
          //   anchorStyleFunc={(anchor) => {
          //     anchor.lef
          //   }}
          enabledAnchors={["bottom-right"]}
          //   visible={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            console.log(newBox.x, position.x, newBox.y, position.y);
            let box;

            if (
              Math.abs(newBox.width) < 5 ||
              Math.abs(newBox.height) < 5 ||
              newBox.x < position.x ||
              newBox.y < position.y
            ) {
              console.log(" oldBox ");

              box = oldBox;
            } else {
              console.log(" newBox ");

              box = newBox;
            }
            dragCircleRef.current?.setPosition({
              x: box.x + box.width,
              y: box.y,
            });
            return box;
          }}
        />
      </Group>
      {/* <Transformer
        ref={trRef}
        flipEnabled={false}
        rotateEnabled={false}
        borderEnabled={false} // Hide bounding box lines
        anchorStroke="white" // Hide anchor points
        anchorFill="#7209B7"
        //   anchorStyleFunc={(anchor) => {
        //     anchor.lef
        //   }}
        enabledAnchors={["bottom-right"]}
        //   visible={false}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          console.log({ newBox, oldBox });
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      /> */}
    </>
  );
};

export default EditorItem;
