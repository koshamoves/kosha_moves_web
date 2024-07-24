"use client";
import { ChatList } from "@/components/messaging";
import { type FC, type PropsWithChildren, useState, useCallback } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [listOpen, setListOpen] = useState(true);
  const closeList = useCallback(() => setListOpen(false), []);
  return (
    <div className="flex h-full">
      <div
        className={cn(
          "flex-1 max-w-[320px] max-[800px]:fixed left-0 z-10 max-[800px]:bg-white-100 max-[800px]:max-w-full max-[800px]:w-full max-[800px]:h-[calc(100dvh-7.2rem)] max-[800px]:overflow-y-auto max-[800px]:top-[6.5rem] min-[800px]:flex",
          !listOpen && "hidden"
        )}
      >
        <ChatList closeList={closeList} />
      </div>
      <div className="flex-1 bg-white-100 relative">
        <Button
          variant="ghost"
          className="font-medium text-grey-300 text-lg lg:hidden border p-0 m-0 w-10 h-10 inline-flex justify-center items-center absolute right-4 top-6 z-20 bg-white-100 min-[800px]:hidden"
          onClick={() => setListOpen((prev) => !prev)}
        >
          {listOpen ? (
            <XIcon className="w-[22px] h-[22px] text-primary block" />
          ) : (
            <MenuIcon className="w-[22px] h-[22px] text-primary block" />
          )}
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Layout;

