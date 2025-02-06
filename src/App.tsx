import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import LogoIcon from "./assets/icons/logo.svg?react";
import ResetIcon from "./assets/icons/reset.svg?react";
import TextIcon from "./assets/icons/text.svg?react";
import BackgroundIcon from "./assets/icons/background.svg?react";
import ImgIcon from "./assets/icons/img.svg?react";
import defaultBgUrl from "./assets/icons/default-bg.png?url";
import Canvas from "./components/Canvas";
import Dialog from "./components/Dialog";
import { ImageItem, TextItem } from "./components/EditorItem";
import EditorControler from "./components/EditorController";

const defaultState = {
  bgUrl: defaultBgUrl,
  items: [],
};
const App = () => {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [size, setSize] = useState({ width: 300, height: 400 });
  const [items, setItems] = useState<(TextItem | ImageItem)[]>(
    defaultState.items
  );
  const [bgUrl, setBgUrl] = useState(defaultState.bgUrl);

  const setDefaultState = () => {
    setItems(defaultState.items);
    setBgUrl(defaultState.bgUrl);
  };

  useEffect(() => {
    if (items.length && defaultState.bgUrl === bgUrl) {
      setBgUrl("");
    }
  }, [items]);

  useEffect(() => {
    if (canvasParentRef.current) {
      const width = canvasParentRef.current?.clientWidth;
      setSize({ width, height: (width / 4) * 5 });
    }
  }, [canvasParentRef.current]);

  const editorControllers = [
    {
      children: <TextIcon width={128} height={128} />,
      label: "Text",
      callback: () => {
        setItems((currentItem) => [
          ...currentItem,
          {
            x: size.width / 2 - 350 / 2,
            y: size.height / 2 - 120,
            width: 350,
            height: 120,
            id: crypto.randomUUID(),
            type: "text",
            textContent: "Type your text here",
          },
        ]);
      },
    },
    {
      children: (
        <>
          <ImgIcon width={128} height={128} />
          <input
            type="file"
            hidden
            ref={imgInputRef}
            onChange={(e) => {
              if (!e.target?.files?.[0]) return;
              const file = e.target?.files?.[0];
              const imageUrl = URL.createObjectURL(file);
              setItems((currentItem) => [
                ...currentItem,
                {
                  x: 200,
                  y: 300,
                  width: 300,
                  height: 300,
                  id: crypto.randomUUID(),
                  type: "image",
                  imageUrl,
                },
              ]);
            }}
          />
        </>
      ),
      label: "Image",
      callback: () => {
        imgInputRef.current?.click();
      },
    },
    {
      children: (
        <>
          <BackgroundIcon width={128} height={128} />
          <input
            type="file"
            hidden
            ref={bgInputRef}
            onChange={(e) => {
              if (!e.target?.files?.[0]) return;
              const file = e.target?.files?.[0];
              setBgUrl(URL.createObjectURL(file));
            }}
          />
        </>
      ),
      label: "Background",
      callback: () => {
        bgInputRef.current?.click();
      },
    },
  ];

  const removeItem = (id: string) => {
    setItems((currItems) => currItems.filter((item) => item.id !== id));
  };

  const handleExportToPng = () => {
    const scaleXRatio = 1080 / size.width;
    const scaleYRatio = 1350 / size.height;
    stageRef.current?.scale({ x: scaleXRatio, y: scaleYRatio });
    const url = stageRef.current?.toDataURL({
      width: 1080,
      height: 1350,
    });
    stageRef.current?.scale({ x: 1, y: 1 });
    if (!url) return;
    const link = document.createElement("a");
    link.download = `CanvasEditor_${new Date().toLocaleString()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen font-poppins">
      <Dialog dialogRef={dialogRef} handleAccept={() => setDefaultState()} />

      <div className="w-full max-w-[1590px] flex mx-auto my-16">
        <div className="w-1/2">
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center shadow-sm bg-black-50"
            ref={canvasParentRef}
          >
            <Canvas
              width={size.width}
              height={size.height}
              editorItems={items}
              bgUrl={bgUrl}
              removeItemHandler={removeItem}
              stageRef={stageRef}
            />
          </div>
        </div>
        <div className="w-1/2 p-6 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <LogoIcon width={64} height={64} />
              </div>
              <h1 className="bold-32 text-black-75">CanvasEditor</h1>
            </div>
            <button
              onClick={() => {
                dialogRef?.current?.showModal();
              }}
              className="flex items-center px-3 py-2 text-red hover:bg-red-50 transition-colors border-b-2"
            >
              <ResetIcon />
              Reset
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-black-100 mb-4 bg-white97 rounded-[10px] px-4 py-6">
              Add content
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {editorControllers.map(({ callback, label, children }) => {
                return (
                  <EditorControler
                    key={label}
                    label={label}
                    onClickCallback={callback}
                  >
                    {children}
                  </EditorControler>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="button" onClick={handleExportToPng}>
              Export to PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
