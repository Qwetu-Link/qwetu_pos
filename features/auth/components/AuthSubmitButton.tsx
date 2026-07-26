import { authPrimaryActionClassName } from "./authStyles";

export default function AuthSubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${authPrimaryActionClassName} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {children}
    </button>
  );
}
