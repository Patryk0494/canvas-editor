import { useEffect, useRef, useState } from "react";
import Canvas from "./components/Canvas";
import LogoIcon from "./assets/icons/logo.svg?react";
import ResetIcon from "./assets/icons/reset.svg?react";
import TextIcon from "./assets/icons/text.svg?react";
import BackgroundIcon from "./assets/icons/background.svg?react";
import ImgIcon from "./assets/icons/img.svg?react";
import { EditorItemPropsType } from "./components/EditorItem";

type EditorControlerPropsType = {
  icon: React.ReactNode;
  label: string;
  onClickCallback: () => void;
};
const EditorControler = ({
  icon,
  label,
  onClickCallback,
}: EditorControlerPropsType) => (
  <div
    onClick={onClickCallback}
    className="text-[#676767] bg-[#F7F7F8] rounded-[10px] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-[365px] h-[256px]"
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const editorItems = [
  {
    x: 100,
    y: 500,
    width: 350,
    height: 120,
    type: "text",
    textContent: "Jaki napis",
  },
  {
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    type: "image",
  },
  {
    x: 100,
    y: 100,
    width: 350,
    height: 120,
    type: "text",
    textContent: "Napis po prawej",
  },
] satisfies EditorItemPropsType[];
const canvasContent = {
  text: "Create your own Poster!",
  subtext:
    "It's so simple. Start creating your own\nposter by clicking one of the action\nbuttons located on the right.",
  background: "#f3d5f9",
};
const App = () => {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [items, setItems] = useState(editorItems);

  const editorControllers = [
    {
      icon: <TextIcon width={128} height={128} />,
      label: "Text",
      callback: () => {
        setItems((currentItem) => [
          ...currentItem,
          {
            x: 10,
            y: 20,
            width: 350,
            height: 120,
            type: "text",
            textContent: "Napis dodany klikiem",
          },
        ]);
        console.log("text click");
      },
    },
    {
      icon: <ImgIcon width={128} height={128} />,
      label: "Image",
      callback: () => {
        console.log("Image click");
      },
    },
    {
      icon: <BackgroundIcon width={128} height={128} />,
      label: "Background",
      callback: () => {
        console.log("text Background");
      },
    },
  ];
  useEffect(() => {
    if (canvasParentRef.current) {
      const width = canvasParentRef.current?.clientWidth;
      const height = canvasParentRef.current?.clientHeight;
      setSize({ width, height });
    }
  }, [canvasParentRef.current]);

  return (
    <div className="h-screen">
      <div className="w-full max-w-[1590px] flex mx-auto my-16">
        <div className="w-1/2 p-4 ">
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center shadow-sm"
            style={{ backgroundColor: canvasContent.background }}
            ref={canvasParentRef}
          >
            <Canvas
              width={size.width}
              height={size.height}
              editorItems={items}
            />

            {/* <div className="w-20 h-20 mb-4">
              {/* <ImageIcon className="w-full h-full text-purple-700" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{canvasContent.text}</h1>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {canvasContent.subtext}
            </p> */}
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
              }}
              className="flex items-center px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <ResetIcon />
              Reset
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Add content</h2>
            <div className="grid grid-cols-2 gap-4">
              {editorControllers.map(({ callback, label, icon }) => {
                return (
                  <EditorControler
                    key={label}
                    icon={icon}
                    label={label}
                    onClickCallback={callback}
                  />
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
