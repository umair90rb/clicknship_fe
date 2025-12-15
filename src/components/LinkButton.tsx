import PrimaryButton, { type PrimaryButtonProps } from "./Button";

export interface LinkButtonProps
  extends Omit<PrimaryButtonProps, "onClick" | "type"> {
  href: string;
  target?: "_blank" | "_self";
}

export default function LinkButton({
  href,
  target = "_blank",
  ...buttonProps
}: LinkButtonProps) {
  return (
    <PrimaryButton
      {...buttonProps}
      component="a"
      type={undefined}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    />
  );
}
