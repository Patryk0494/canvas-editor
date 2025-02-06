import Konva from "konva";
import svgUrl from "../assets/icons/delete.png?url";
import moveSvgUrl from "../assets/icons/move.png?url";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image, Circle, Text, Line } from "react-konva";
import { Html, useImage } from "react-konva-utils";
import CircleWithIcon from "./CircleWithIcon";

type BaseEditorPropsType = {
  selectedItem: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  removeItemHandler: (id: string) => void;
};
export type TextItem = {
  type: "text";
  textContent?: string;
} & EditorItemStateBase;

export type ImageItem = {
  type: "image";
  imageUrl: string;
} & EditorItemStateBase;

export type EditorItemStateBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EditorItemPropsType =
  | (BaseEditorPropsType & TextItem)
  | (BaseEditorPropsType & ImageItem);

const isText = (
  props: EditorItemPropsType
): props is BaseEditorPropsType & TextItem => props.type === "text";
const colors = ["#353535", "#FFFFFF", "#CF0000", "#0055FF", "#00DA16"];

const EditorItem = (props: EditorItemPropsType) => {
  const {
    x,
    y,
    width,
    height,
    id,
    selectedItem,
    setSelectedItem,
    removeItemHandler,
  } = props;

  const trRef = useRef<Konva.Transformer>(null);
  const childrenRef = useRef<Konva.Text | Konva.Image>(null);
  const groupRef = useRef<Konva.Group>(null);
  const dragRef = useRef<Konva.Group>(null);
  const resizeRef = useRef<Konva.Group>(null);
  const removeCircleGroupRef = useRef<Konva.Group>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [image] = useImage(!isText(props) ? props?.imageUrl : "");
  const [size, setSize] = useState({ width, height });
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (!image) return;
    const aspectRatio =
      image.width > image.height ? 200 / image.width : 200 / image.height;

    setSize({
      width: image.width * aspectRatio,
      height: image.height * aspectRatio,
    });
  }, [image]);
  const [selectedColor, setSelectedColor] = useState("#353535");
  const handleResize = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x: pointerX, y: pointerY } = e.target.getAbsolutePosition();
    const newWidth = pointerX - position.x;
    const newHeight = pointerY - position.y;
    // Prevent negative width and height to stay inside bounds
    if (newWidth > 20 && newHeight > 20) {
      setSize({ width: newWidth, height: newHeight });
    }
    // Calculate new font size proportionally (optional tweak)
    if (!isText(props)) return;
    const newFontSize = Math.min(newWidth / 10, newHeight / 5);

    if (newFontSize > 12) {
      (childrenRef as React.RefObject<Konva.Text>).current?.fontSize(
        newFontSize
      );
    }
  };

  const handleItemClick = () => {
    if (childrenRef?.current && trRef?.current) {
      trRef.current?.nodes([]);
      trRef.current?.nodes([childrenRef.current]);
      groupRef.current?.moveToTop();
      trRef.current?.getLayer()?.batchDraw();
    }
    setSelectedItem(id);
  };
  useEffect(() => {
    if (childrenRef?.current) {
      if (selectedItem !== id) {
        trRef.current?.nodes([]);
      } else {
        trRef.current?.nodes([childrenRef?.current]);
      }
    }
  }, [selectedItem]);
  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      id={id}
      onDragMove={(e) => {
        setPosition({
          x: e.currentTarget.position().x,
          y: e.currentTarget.position().y,
        });
      }}
    >
      <Line
        points={[0, 0, 0, size.height, size.width, size.height, size.width, 0]}
        stroke="#7209B7"
        strokeWidth={2}
        visible={selectedItem === id}
        closed
      />
      {isText(props) ? (
        <>
          <Text
            ref={childrenRef as React.RefObject<Konva.Text>}
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            id={id}
            fontSize={36}
            fontStyle="bold"
            opacity={0.25}
            fill={selectedColor}
            align="center"
            verticalAlign="middle"
            text={props.textContent}
            onDblClick={() => {
              childrenRef?.current?.hide();
              setIsEditing(true);
            }}
            onClick={handleItemClick}
          />
          <Html>
            <textarea
              className=" focus:outline-none "
              autoFocus
              placeholder="wpisz coś tutaj"
              spellCheck="false"
              hidden={!isEditing}
              style={{
                position: "absolute",
                width: size.width + "px",
                height: size.height + "px",
                color: selectedColor,
                fontSize:
                  ((
                    childrenRef as React.RefObject<Konva.Text>
                  ).current?.fontSize() || 16) *
                    ((
                      childrenRef as React.RefObject<Konva.Text>
                    ).current?.scaleX() || 1) +
                  "px",
                fontWeight: "bold",
                textAlign: "center",
                textAlignLast: "center",
                lineHeight: (
                  childrenRef as React.RefObject<Konva.Text>
                ).current?.lineHeight(),
              }}
              defaultValue={(
                childrenRef as React.RefObject<Konva.Text>
              ).current?.text()}
              onChange={(e) => {
                const textNode = (childrenRef as React.RefObject<Konva.Text>)
                  .current;
                if (!textNode) return;
                if (textNode.opacity() === 0.25) {
                  textNode.opacity(1);
                }
                textNode.text(e.target.value);
                textNode.getLayer()?.batchDraw();
              }}
              onBlur={() => {
                setIsEditing(false);
                childrenRef.current?.show();
              }}
            />
          </Html>
        </>
      ) : (
        <Image
          ref={childrenRef as React.RefObject<Konva.Image>}
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          image={image}
          id={id}
          fillPatternRepeat="no-repeat"
          onClick={handleItemClick}
        />
      )}
      <CircleWithIcon
        groupRef={dragRef}
        x={0}
        y={0}
        radius={20}
        fillPaternUrl={moveSvgUrl}
        visible={selectedItem === id}
        fill="white"
        onMouseEnter={() => groupRef?.current?.setDraggable(true)}
        onMouseLeave={() => groupRef?.current?.setDraggable(false)}
      />
      <Circle
        groupRef={resizeRef}
        x={size.width}
        y={size.height}
        radius={12}
        visible={selectedItem === id}
        borderStrokeWidth={2}
        borderStroke="#7209B7"
        stroke="white"
        fill="#7209B7"
        strokeWidth={4}
        draggable
        onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => handleResize(e)}
      />
      <CircleWithIcon
        x={size.width}
        y={0}
        fill="white"
        fillPaternUrl={svgUrl}
        groupRef={removeCircleGroupRef}
        visible={selectedItem === id}
        onClick={() => removeItemHandler(id)}
      />
      {isText(props) &&
        selectedItem === id &&
        colors.map((color, index) => (
          <Group key={color} x={10 + index * 28} y={size.height + 20}>
            <Circle
              radius={12}
              fill="transparent"
              strokeEnabled={selectedColor === color}
              stroke={selectedColor === color ? "white" : undefined}
              strokeWidth={selectedColor === color ? 2 : 0}
            />
            <Circle
              radius={8}
              fill={color}
              onClick={() => setSelectedColor(color)}
            />
          </Group>
        ))}
    </Group>
  );
};

export default EditorItem;
