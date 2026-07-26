import Link from "next/link";
import { authPrimaryActionClassName } from "./authStyles";

export default function AuthActionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={authPrimaryActionClassName}
    >
      {children}
    </Link>
  );
}
