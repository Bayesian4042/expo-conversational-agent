import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "@/lib/utils";
import { Platform } from "react-native";
import { Slot } from "@radix-ui/react-slot";

const ChatTextInput = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    asChild?: boolean;
    noFocus?: boolean;
    autoFocus?: boolean;
  }
>(
  (
    {
      className,
      placeholderClassName,
      asChild = false,
      noFocus = false,
      autoFocus = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : TextInput;

    return (
      <Comp
        ref={ref}
        autoFocus={autoFocus}
        className={cn(
          "native:min-h-10 native:text-md native:leading-[1.25] min-h-10 rounded-md bg-background px-4 text-base text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 lg:text-sm",
          "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          noFocus && "web:focus-visible:ring-0 web:focus-visible:ring-offset-0",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  },
);

ChatTextInput.displayName = "ChatTextInput";

export { ChatTextInput };
