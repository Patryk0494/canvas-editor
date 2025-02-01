import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Text } from "react-konva";
import EditorItem, { EditorItemPropsType } from "./EditorItem";
import { Html } from "react-konva-utils";

const Canvas = ({
  width,
  height,
  editorItems,
}: {
  width: number;
  height: number;
  editorItems: EditorItemPropsType[];
}) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const txtRef = useRef<Konva.Text>(null);

  const trRef = useRef<Konva.Transformer>(null);
  const polygonRef = useRef<Konva.Line>(null);
  const groupRef = useRef<Konva.Group>(null);
  const scaleCircleRef = useRef<Konva.Circle>(null);

  const [points, setPoints] = useState<number[]>();

  //   React.useEffect(() => {
  //     if (trRef.current && shapeRef.current) {
  //       trRef.current.nodes([shapeRef.current]);
  //       trRef.current.getLayer()?.batchDraw();
  //       trRef.current.anchorSize();
  //     }
  //   }, []);
  //   if (shapeRef?.current) {
  //     shapeRef.current.getClientRect();
  //     polygonRef.current.getClientRect();
  //   }

  const initialCirclePos = { x: 150, y: 150 };
  const groupOrigin = { x: 50, y: 50 };

  const [circlePos, setCirclePos] = useState(initialCirclePos);
  const [text, setText] = useState("initialCirclePos");

  const initialDistance = Math.sqrt(
    Math.pow(initialCirclePos.x - groupOrigin.x, 2) +
      Math.pow(initialCirclePos.y - groupOrigin.y, 2)
  );

  const handleDragMove = (e) => {
    const newPos = e.target.position();
    // setCirclePos(newPos);
    scaleCircleRef.current?.position(newPos);

    if (groupRef.current) {
      const deltaX = newPos.x - initialCirclePos.x;
      const deltaY = newPos.y - initialCirclePos.y;
      const scaleFactorX = 1 + deltaX / 100;
      const scaleFactorY = 1 + deltaY / 100;

      // Scale group and compensate for circle position
      groupRef.current.scale({ x: scaleFactorX, y: scaleFactorY });

      // Compute the adjusted circle position
      const adjustedCirclePos = {
        x: groupOrigin.x + scaleFactorX * (initialCirclePos.x - groupOrigin.x),
        y: groupOrigin.y + scaleFactorY * (initialCirclePos.y - groupOrigin.y),
      };

      e.target.position(adjustedCirclePos);
      groupRef.current.getLayer()?.batchDraw();
    }
  };
  React.useEffect(() => {
    trRef?.current?.nodes([txtRef?.current]);
    trRef?.current?.getLayer().batchDraw();
  }, [txtRef.current]);
  return (
    <Stage width={width} height={height}>
      <Layer>
        <Text
          ref={txtRef}
          x={50}
          y={50}
          width={100}
          height={100}
          draggable
          text="TEXT do skalowania"
        />
        <Transformer
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
        />
        {/* <Html>
          <input
            className="text-transparent focus:outline-none"
            type="text"
            placeholder="wpisz coś tutaj"
            onChange={(e) => setText(e.target.value)}
            spellCheck="false"
          />
        </Html> */}

        {/* <Text
          ref={txtRef}
          x={50}
          y={650}
          draggable
          text={text}
          onDblClick={() => {}}
        /> */}

        {editorItems.map(({ x, y, width, height, type, textContent }) => (
          <EditorItem
            x={x}
            y={y}
            height={height}
            width={width}
            type={type}
            textContent={textContent}
            // TODO generate proper key
            key={type + x + y}
          ></EditorItem>
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
