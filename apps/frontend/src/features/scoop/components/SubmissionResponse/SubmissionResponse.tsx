import { useDisclosure, useSubmission } from "@/hooks";
import { CheckCircle, XCircle } from "lucide-react";
import Confetti from "react-confetti";

export const SubmissionResponse = () => {
  const { response, setResponse } = useSubmission();
  const { onClose } = useDisclosure();

  if (!response) return null;

  const handleOnClick = () => {
    onClose();
    setResponse(null);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-4 text-center gap-12">
      {response.success ? (
        <>
          <Confetti
            className="w-fit h-full"
            aria-hidden="true"
            recycle={false}
          />
          <CheckCircle className="text-accent" size={72} />
        </>
      ) : (
        <XCircle className="text-destructive" size={72} />
      )}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-2xl">
          Well done! Thank you for keeping our environment clean.
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-4xl font-bold">{response.reward}</p>
          <img
            src="/images/b3tr-token.svg"
            alt="b3tr-token symbol"
            className="w-6 h-6"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p>Remaining submissions:</p>
        <p className="text-2xl font-bold">{response.remainingSubmissions}</p>
      </div>
      <button
        onClick={handleOnClick}
        className={`flex flex-col items-center bg-accent text-accent-foreground font-semibold text-lg py-2 px-8 w-fit rounded-full shadow-lg transition-colors duration-300 cursor-pointer hover:bg-accent/90"}`}
      >
        Done
      </button>
    </div>
  );
};
