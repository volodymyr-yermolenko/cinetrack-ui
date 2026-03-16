import { useEffect, useRef } from "react";
import { LoaderCircle, X } from "lucide-react";

export type ConfirmVariant = "regular" | "danger";

interface ConfirmDialogProps {
  isOpen: boolean;
  header: string;
  message: string;
  isPending?: boolean;
  error?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [props.isOpen]);

  const handleConfirmClick = () => {
    props.onConfirm();
  };

  const handleCancelClick = () => {
    props.onCancel();
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleCancelClick();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto p-5 rounded-lg shadow-lg w-full max-w-md"
      onClick={handleDialogClick}
      onClose={handleCancelClick}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <h3 className="text-xl font-bold">{props.header}</h3>
          <button
            className="btn-icon-mini btn-ghost focus:outline-none"
            onClick={handleCancelClick}
            disabled={props.isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-700">{props.message}</p>
        {props.error && <p className="text-sm text-red-600">{props.error}</p>}
        <div className="flex flex-row gap-3 mt-3 justify-end">
          <button
            onClick={handleCancelClick}
            className="btn btn-small btn-secondary"
            disabled={props.isPending}
          >
            {props.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirmClick}
            className={
              props.variant === "danger"
                ? "btn btn-small btn-danger"
                : "btn btn-small btn-primary"
            }
            disabled={props.isPending}
          >
            {!props.isPending ? (
              props.confirmText || "Confirm"
            ) : (
              <LoaderCircle className="mx-2 animate-spin" />
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
