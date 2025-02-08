interface MainWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

export default function MainWrapper({ children, className }: MainWrapperProps) {
  return (
    <div className={`flex flex-col flex-1 w-full px-2 py-2 gap-4 ${className}`}>
      {children}
    </div>
  );
}
