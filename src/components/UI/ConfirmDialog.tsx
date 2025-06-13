import { Modal } from "./Modal";
import { LoadingSpinner } from "./LoadingSpinner";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}) => {
  const variantClasses = {
    danger: 'text-error',
    warning: 'text-warning',
    info: 'text-primary dark:text-primary-dark',
  };

  const buttonVariants = {
    danger: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`text-2xl ${variantClasses[variant]}`}>
            {variant === 'danger' && '⚠️'}
            {variant === 'warning' && '⚠️'}
            {variant === 'info' && 'ℹ️'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-theme mb-2">{title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${buttonVariants[variant]}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
