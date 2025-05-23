import { FC, PropsWithChildren } from "react";

// FIXME: what does this file even do?

const Layout: FC<PropsWithChildren> = ({ ...props }) => (
  <div {...props} className="w-full h-full flex flex-col items-center justify-start" />
);

export default Layout;