/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { icons } from 'lucide-react';
import Icon from "./Icon";
import type { SessionPayload } from "@/lib/definitions";
import { useRouter, usePathname, redirect } from 'next/navigation';
import { logout } from "@/lib/auth";

const Sidebar = ({ session }: { session: string | null}) => {
  const Menus: { title: string, icon: keyof typeof icons, gap?: boolean, path: string[] }[] = [
    { title: "Home", icon: "House", path: ["/"] },
    { title: "Collections", icon: "House", path: ["/collections"] },
    { title: "Your Library", icon: "BriefcaseBusiness", path: ["/library"] },
  ];

  if (session) {
    const data: SessionPayload = JSON.parse(session);
    Menus.push({ title: "Create Flashcards", icon: "BriefcaseBusiness", gap: true, path: ["/flashcards/create"] })
    Menus.push({ title: "Create Collections", icon: "PanelsTopLeft", path: ["/collections/create"] }),
    Menus.push({ title: "Settings", icon: "Cog", gap: true, path: ["/settings"] },)
    Menus.push({ title: "Account", icon: "CircleUser", path: ["/account"] });
    if (data.user.admin === true) {
      Menus.push({ title: "Admin", icon: "ServerCog", path: ["/admin"] });
    }
  } else {
    Menus.push({ title: "Settings", icon: "Cog", gap: true, path: ["/settings"] })
    Menus.push({ title: "Sign in", icon: "CircleUser", path: ["/login","/register"] });
  }

  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("");
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    const currentMenu = Menus.find(menu => {
      return menu.path.includes(pathname);
    });
  
    setCurrentPage(currentMenu ? currentMenu.title : ""); 
  }, [pathname, session]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className={`${open ? "w-60" : "w-20"} bg-background h-full p-5 pt-8 relative transition-all duration-500 ease-in-out flex flex-col justify-between`}>
        <div>
          <div className="flex gap-x-4 items-center">
            <Image alt="" src="/assets/smiley.svg" className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} width={56} height={56} onClick={() => setOpen(!open)} />
            <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>TestVar</h1>
          </div>
          <ul className="pt-6 font-semibold">
            {Menus.map((Menu, index) => (
              <div key={index} className="mb-1">
                {Menu.gap && <hr className="my-4 border-gray-500" />}
                <li 
                  className={`flex rounded-md p-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 
                  ${currentPage === Menu.title ? "bg-gray-700 rounded-xl !text-[#a8b1ff]" : "hover:bg-gray-500 hover:rounded-xl "}`}
                  onClick={() => handleMenuClick(Menu.path[0])}
                >
                  <Icon name={Menu.icon} />
                  <span className={`${!isVisible ? "hidden" : ""} transition-transform duration-200 origin-left`}>
                    {Menu.title}
                  </span>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="pb-4">
          {session && (
            <button
              onClick={() => {
                logout()
                redirect('/')
              }}
              className="flex items-center p-2 rounded-md text-gray-300 text-sm hover:bg-gray-500 hover:rounded-xl gap-x-4 w-full"
            >
              <Icon name="LogOut" />
              <span className={`${!isVisible ? "hidden" : ""} transition-transform duration-200 origin-left`}>
                Logout
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;