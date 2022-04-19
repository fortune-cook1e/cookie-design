import { MouseEventHandler } from "react";
export interface ButtonProps {
    type: "primary" | "error";
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
