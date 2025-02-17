import * as React from "react";

import { Button } from "@/src/shared/ui";
import { cn } from "@/src/shared/lib/utils";
import type { StepSharedProps } from "./types";
import { useStepper } from "../lib/use-stepper";

type StepButtonContainerProps = StepSharedProps & {
  children?: React.ReactNode;
};

const StepButtonContainer = ({
  isCurrentStep,
  isCompletedStep,
  children,
  isError,
  isLoading: isLoadingProp,
  onClickStep,
}: StepButtonContainerProps) => {
  const { clickable, isLoading: isLoadingContext, variant, styles } = useStepper();

  const currentStepClickable = clickable || !!onClickStep;

  const isLoading = isLoadingProp || isLoadingContext;

  if (variant === "line") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      type="button"
      tabIndex={currentStepClickable ? 0 : -1}
      className={cn(
        "stepper__step-button-container",
        "rounded-full p-0 pointer-events-none",
        "w-[var(--step-icon-size)] h-[var(--step-icon-size)]",
        "border-2 flex rounded-full justify-center items-center",
        "data-[clickable=true]:pointer-events-auto",
        "data-[active=true]:bg-primary data-[active=true]:border-primary data-[active=true]:text-primary-foreground dark:data-[active=true]:bg-primary dark:data-[active=true]:border-primary dark:data-[active=true]:text-primary-foreground",
        "data-[current=true]:border-primary data-[current=true]:bg-primary data-[current=true]:text-primary-foreground dark:data-[current=true]:border-primary dark:data-[current=true]:bg-primary dark:data-[current=true]:text-primary-foreground",
        "data-[invalid=true]:bg-destructive data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive-foreground dark:data-[invalid=true]:bg-red-600 dark:data-[invalid=true]:border-red-600 dark:data-[invalid=true]:text-red-100",
        styles?.["step-button-container"]
      )}
      aria-current={isCurrentStep ? "step" : undefined}
      data-current={isCurrentStep}
      data-invalid={isError && (isCurrentStep || isCompletedStep)}
      data-active={isCompletedStep}
      data-clickable={currentStepClickable}
      data-loading={isLoading && (isCurrentStep || isCompletedStep)}
    >
      {children}
    </Button>
  );
};

export { StepButtonContainer };
