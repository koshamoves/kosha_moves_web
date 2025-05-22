import { FC } from "react";
import { Picture } from "@/components/atoms";
import { NavItem } from ".";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { Calendar, Chat, GiftCard, Home, User } from "@/components/Icons";
import { Routes } from "@/core/routing";
import { usePathname } from "next/navigation";

export const SideNav: FC<{ nonAuth?: boolean }> = ({ nonAuth }) => {
  const { isActiveRoute } = useActiveRoute();
  const path = usePathname();
  const sizes = {
    width: 22,
    height: 22,
  };
  const sequenceRoutes = Object.values(Routes.sequence);
  const messagesRouteMatch = path.match(/^\/messages\/([^/]+)$/);

  const SIDE_NAV_MENU_DATA = [
    {
      title: "Home",
      icon: (
        <Home
          {...sizes}
          invertcolor={
            isActiveRoute(Routes.root) || sequenceRoutes.includes(path)
          }
        />
      ),
      route: Routes.root,
    },
    {
      title: "Bookings",
      icon: (
        <Calendar {...sizes} invertcolor={isActiveRoute(Routes.bookings)} />
      ),
      route: Routes.bookings,
    },
    {
      title: "Messages",
      icon: (
        <Chat
          {...sizes}
          invertcolor={isActiveRoute(Routes.messages) || !!messagesRouteMatch}
        />
      ),
      route: Routes.messages,
    },
          {
      title: "Buy Gift Card",
      icon: (
        <GiftCard {...sizes} invertcolor={isActiveRoute(Routes.giftCard)} />
      ),
      route: Routes.giftCard,
    },
    {
      title: "Profile",
      icon: <User {...sizes} invertcolor={isActiveRoute(Routes.profile)} />,
      route: Routes.profile,
    },
  ] as const;
  return (
    <aside className="bg-primary h-full flex flex-col gap-6">
      <div className="px-4 pt-8 pb-12">
        <Picture
          container={{
            className: "w-full max-w-[130px] h-[34px]",
          }}
          image={{
            alt: "",
            src: "/images/Logo.png",
          }}
        />
      </div>
      <div className="py-6 flex flex-col gap-4">
        {SIDE_NAV_MENU_DATA.map((item, indx) => (
          <NavItem
            key={item.title + indx}
            data={{
              ...item,
              isActive:
                isActiveRoute(item.route) ||
                (item.route === Routes.root && sequenceRoutes.includes(path)) ||
                (item.route === Routes.messages && !!messagesRouteMatch),
            }}
          />
        ))}
      </div>
    </aside>
  );
};
