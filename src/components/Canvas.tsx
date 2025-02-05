import Konva from "konva";
import React, { useRef, useState } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import EditorItem, { EditorItemPropsType } from "./EditorItem";
import { useImage } from "react-konva-utils";

const Canvas = ({
  width,
  height,
  editorItems,
  bgUrl,
  removeItemHandler,
}: {
  width: number;
  height: number;
  editorItems: EditorItemPropsType[] | [];
  bgUrl?: string;
  removeItemHandler: (id: string) => void;
}) => {
  const [bgImage, bgImageState] = useImage(bgUrl || "");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const stageRef = useRef<Konva.Stage>(null);

  return (
    <Stage ref={stageRef} width={width} height={height}>
      <Layer>
        <Image image={bgImage} width={width} height={height} name="bgImage" />
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
              stageRef={stageRef}
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
