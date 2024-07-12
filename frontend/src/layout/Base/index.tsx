import { PropsWithChildren } from "react";
import RightPanel from "../../components/common/RightPanel";
import Sidebar from "../../components/common/Sidebar";

export default function BaseLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Sidebar />
      {children}
      <RightPanel />
    </>
  );
}
