import Konva from "konva";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import EditorItem, { ImageItem, TextItem } from "./EditorItem";
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
  editorItems: (ImageItem | TextItem)[];
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
        {editorItems.map((item) => (
          <EditorItem
            x={item.x}
            y={item.y}
            height={item.height}
            width={item.width}
            type={item.type}
            textContent={item.type === "text" ? item.textContent : ""}
            key={item.id}
            imageUrl={item.type === "image" ? item.imageUrl : ""}
            id={item.id}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            removeItemHandler={removeItemHandler}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
