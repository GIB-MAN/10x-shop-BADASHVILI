
type RemoveButtonProps = {
  onRemove: () => void;
};

function RemoveButton({ onRemove }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      წაშლა
    </button>
  );
}

export default RemoveButton;
