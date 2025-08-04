import React, { forwardRef } from "react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ButtonWithTooltipProps {
  children: React.ReactElement;
  side: "top" | "bottom" | "left" | "right";
  toolTipText: string;
}

const ButtonWithTooltip = forwardRef<HTMLButtonElement, ButtonWithTooltipProps>(
  ({ children, side, toolTipText }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {React.isValidElement(children) &&
              React.cloneElement(children as React.ReactElement<any>, { ref })}
          </TooltipTrigger>
          <TooltipContent side={side}>
            <div>{toolTipText}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ButtonWithTooltip.displayName = "ButtonWithTooltip";

export default ButtonWithTooltip;
