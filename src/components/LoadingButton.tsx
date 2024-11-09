import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

function LoadingButton({ isLoading, className, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={isLoading} {...props} className={cn("w-full", className)}>
      {isLoading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
}

export default LoadingButton;
