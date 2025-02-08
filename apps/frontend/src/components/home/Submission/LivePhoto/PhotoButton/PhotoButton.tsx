import { PhotoButtonProps } from "./PhotoButton.types";

export const PhotoButton = ({
  type,
  icon: Icon,
  label,
  disabled,
  inputRef,
  createHandleCameraCapture,
}: PhotoButtonProps) => {

  return (
    <div className="flex items-center gap-8">
      <button
        className={`p-3 rounded-full shadow-lg transition-colors duration-300 bg-secondary text-secondary-foreground ${
          disabled ? "opacity-50" : "cursor-pointer"
        }`}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <Icon size={36} />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          onChange={createHandleCameraCapture(type)}
          className="hidden"
          aria-label={label}
          disabled={disabled}
        />
      </button>
      <h3 className="text-xl font-semibold text-primary-foreground">{label}</h3>
    </div>
  );
};
