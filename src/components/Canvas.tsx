import Konva from "konva";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import EditorItem, { ImageProps, TextProps } from "./EditorItem";
import { useImage } from "react-konva-utils";

const Canvas = ({
  width,
  height,
  editorItems,
  bgUrl,
  removeItemHandler,
  stageRef,
}: {
  width: number;
  height: number;
  editorItems: (ImageProps | TextProps)[];
  bgUrl?: string;
  removeItemHandler: (id: string) => void;
  stageRef: React.RefObject<Konva.Stage>;
}) => {
  const [bgImage] = useImage(bgUrl || "");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (editorItems.length > 0 && editorItems.at(-1)?.id) {
      setSelectedItem(editorItems.at(-1)!.id);
    }
  }, [editorItems]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() || e.target.attrs.name === "bgLayer") {
      setSelectedItem(null);
    }
  };
  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onClick={handleStageClick}
    >
      <Layer>
        <Image image={bgImage} width={width} height={height} name="bgLayer" />
        {editorItems.map(
          ({
            x,
            y,
            width,
            height,
            type,
            textContent = "",
            imageUrl = "",
            id,
          }) => (
            <EditorItem
              x={x}
              y={y}
              height={height}
              width={width}
              type={type}
              textContent={textContent}
              key={id}
              imageUrl={imageUrl}
              id={id}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              removeItemHandler={removeItemHandler}
            ></EditorItem>
          )
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;
