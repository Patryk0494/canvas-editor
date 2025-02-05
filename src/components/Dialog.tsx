import React from "react";
import AlertSvg from "../assets/icons/alert.svg?react";
import CloseSvg from "../assets/icons/close.svg?react";

type DialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement>;
  handleAccept: () => void;
};
const Dialog = ({ dialogRef, handleAccept }: DialogProps) => {
  const closeDialog = () => {
    dialogRef.current?.close();
  };
  return (
    <dialog
      ref={dialogRef}
      id="dialog"
      tabIndex={-1}
      className="bg-black-25/20 fixed inset-0 z-50 w-full h-full p-0"
    >
      <div className="flex justify-center items-center min-h-full">
        <div className="relative bg-white rounded-lg shadow-md w-full max-w-[35vw] px-32 py-12">
          <button
            type="button"
            className="absolute top-8 end-8 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeDialog}
          >
            <CloseSvg />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex flex-col items-center justify-center ">
            <AlertSvg className="text-red" width={290} height={290} />

            <div className="text-center">
              <h1 className="bold-32 text-black-100">WARNING</h1>
              <h3 className="mb-5 text-lg font-medium text-[18px] text-black-75">
                You’re about to reset whole process. Are you sure you want to do
                it?
              </h3>
              <button
                onClick={closeDialog}
                className="button text-black-100 bg-transparent"
              >
                Cancel
              </button>
              <button
                data-modal-hide="popup-modal"
                className="button"
                onClick={() => {
                  handleAccept();
                  closeDialog();
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
