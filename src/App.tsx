import { useEffect, useRef, useState } from "react";
import Canvas from "./components/Canvas";
import LogoIcon from "./assets/icons/logo.svg?react";
import ResetIcon from "./assets/icons/reset.svg?react";
import TextIcon from "./assets/icons/text.svg?react";
import BackgroundIcon from "./assets/icons/background.svg?react";
import ImgIcon from "./assets/icons/img.svg?react";
import { EditorItemPropsType } from "./components/EditorItem";
import defaultBgUrl from "./assets/icons/default-bg.png?url";

type EditorControlerPropsType = {
  children: React.ReactNode;
  label: string;
  onClickCallback: () => void;
};
const EditorControler = ({
  children,
  label,
  onClickCallback,
}: EditorControlerPropsType) => (
  <button
    onClick={onClickCallback}
    className="text-[#676767] bg-[#F7F7F8] rounded-[10px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors w-[365px] h-[256px]  hover:bg-[#CDCDCD] focus:bg-[#F7F7F8] focus:border-4 border-[#7209B780] focus:outline-0"
  >
    {children}
    <span className="text-sm">{label}</span>
  </button>
);

const id1 = crypto.randomUUID();
const id2 = crypto.randomUUID();

// const [] = [
//   {
//     x: 100,
//     y: 500,
//     width: 350,
//     height: 120,
//     type: "text",
//     textContent: "Jaki napis",
//     id: id1,
//   },
//   {
//     x: 200,
//     y: 100,
//     width: 200,
//     height: 200,
//     type: "image",
//     id: id2,
//   },
// ] satisfies EditorItemPropsType[];
const defaultState = {
  bgUrl: defaultBgUrl,
  items: [],
};
const App = () => {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [items, setItems] = useState<EditorItemPropsType[]>(defaultState.items);
  const [bgUrl, setBgUrl] = useState(defaultState.bgUrl);

  const setDefaultState = () => {
    setItems(defaultState.items);
    setBgUrl(defaultState.bgUrl);
  };
  useEffect(() => {
    if (items.length && defaultState.bgUrl === bgUrl) {
      setBgUrl("");
    }
  });
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
                  width: 200,
                  height: 200,
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

  const removeItem = (id) => {
    setItems((currItems) => currItems.filter((item) => item.id !== id));
  };

  return (
    <div className="h-screen">
      <div className="w-full max-w-[1590px] flex mx-auto my-16">
        <div className="w-1/2">
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center shadow-sm bg-[#9B9B9B]"
            ref={canvasParentRef}
          >
            <Canvas
              width={size.width}
              height={size.height}
              editorItems={items}
              bgUrl={bgUrl}
              removeItemHandler={removeItem}
            />
          </div>
        </div>
        <div className="w-1/2 p-6 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <LogoIcon width={64} height={64} />
              </div>
              <h1 className="text-xl font-semibold">CanvasEditor</h1>
            </div>
            <button
              onClick={() => {
                console.log("reset");
                setDefaultState();
              }}
              className="flex items-center px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors border-b-2"
            >
              <ResetIcon />
              Reset
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 bg-[#F7F7F8] rounded-[10px] px-4 py-6">
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
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Export to PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
