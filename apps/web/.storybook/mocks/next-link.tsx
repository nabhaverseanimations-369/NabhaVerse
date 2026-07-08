import * as React from "react";

interface NextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export default function Link({ href, children, ...props }: NextLinkProps): React.JSX.Element {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
