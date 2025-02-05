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
    className="text-black-75 bg-white97 rounded-[10px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors w-[365px] h-[256px]  hover:bg-black-25 focus:bg-white97 focus:border-4 border-primary-50 focus:outline-0"
  >
    {children}
    <span className="text-sm">{label}</span>
  </button>
);

export default EditorControler;
