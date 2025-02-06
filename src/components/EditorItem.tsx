import Konva from "konva";
import svgUrl from "../assets/icons/delete.png?url";
import moveSvgUrl from "../assets/icons/move.png?url";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image, Circle, Text, Transformer } from "react-konva";
import { Html, useImage } from "react-konva-utils";
import CircleWithIcon from "./CircleWithIcon";
export interface TextProps extends EditorItemStateType {
  type: "text";
  textContent?: string;
}

export interface ImageProps extends EditorItemStateType {
  type: "image";
  imageUrl: string;
}
export type EditorItemStateType = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EditorItemPropsType = {
  selectedItem: null | string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  removeItemHandler: (id: string) => void;
} & (TextProps | ImageProps);

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
  const removeCircleGroupRef = useRef<Konva.Group>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [image] = useImage(props?.imageUrl || "");
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    const aspectRatio = image ? image.width / image.height : 1;

    setSize(
      aspectRatio > 1
        ? { width: width, height: height / aspectRatio }
        : { width: width / aspectRatio, height: height }
    );
  }, [image]);
  const [selectedColor, setSelectedColor] = useState("#353535");

  const isText = (props: EditorItemPropsType): props is TextProps =>
    props.type === "text";

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
    <Group ref={groupRef} x={x} y={y} id={id}>
      {isText(props) ? (
        <>
          <Text
            ref={childrenRef as React.RefObject<Konva.Text>}
            x={0}
            y={0}
            width={width}
            height={height}
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
      <Transformer
        ref={trRef}
        flipEnabled={false}
        rotateEnabled={false}
        name="transformer"
        borderStrokeWidth={2}
        borderStroke="#7209B7"
        anchorStroke="white" // Hide anchor points
        anchorFill="#7209B7"
        anchorCornerRadius={20}
        anchorStrokeWidth={4}
        anchorSize={24}
        enabledAnchors={["bottom-right"]}
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            trRef.current?.resizeEnabled(false);
            return oldBox;
          }
          removeCircleGroupRef.current?.setPosition({
            x: newBox.width,
            y: 0,
          });
          setSize(newBox);
          trRef.current?.getLayer()?.batchDraw();
          return newBox;
        }}
      />
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
