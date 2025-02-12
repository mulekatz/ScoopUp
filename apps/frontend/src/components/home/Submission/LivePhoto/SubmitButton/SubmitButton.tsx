import { Timer } from "@/components/home/Submission/Timer";
import { SubmitButtonProps } from "./SubmitButton.types";


export default function SubmitButton({ handleSubmitAllImages, disabled }: SubmitButtonProps) {
  return (
    <button
      onClick={handleSubmitAllImages}
      disabled={disabled}
      className={`flex flex-col items-center bg-accent text-accent-foreground font-semibold text-lg py-4 px-12 w-fit rounded-full shadow-lg transition-colors duration-300 
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/90"}`}


    >
      Submit your Scoop
      <Timer />
    </button>
  );
}

