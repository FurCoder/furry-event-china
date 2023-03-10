import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

export default function Header() {
  const { pathname } = useRouter();

  const bodyRef = useRef<HTMLBodyElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    bodyRef.current = document.querySelector("body");
  }, []);

  const handleMenuClick = (openStatus: boolean) => {
    setIsMenuOpen(openStatus);

    if (bodyRef.current) {
      if (openStatus) {
        bodyRef.current.classList.add("overflow-y-hidden");
      } else {
        bodyRef.current.classList.remove("overflow-y-hidden");
      }
    }
  };

  return (
    <header className="mb-6 rounded-b-xl bg-white flex justify-between items-center1 max-sm:sticky max-sm:top-0 max-sm:z-20 max-sm:shadow">
      <div className="m-6 text-4xl text-geraldine font-bold">
        <span className="block">FEC 🐺🐱🐯</span>
        <span className="text-base mt-0 block">毛茸茸展会目录</span>
      </div>
      <div
        className="block sm:hidden flex align-end justify-end mx-4 px-6 py-8 text-3xl text-red-400 items-center"
        onClick={() => handleMenuClick(true)}
      >
        <HiMenu />
      </div>
      <nav
        className={clsx(
          "mr-6 block max-sm:fixed max-sm:z-10 max-sm:h-full max-sm:bg-white max-sm:right-0 max-sm:mr-0 max-sm:w-3/4 transform transition-all duration-200 max-sm:shadow",
          !isMenuOpen && "max-sm:translate-x-full"
        )}
      >
        <div
          className="block sm:hidden flex align-end justify-end mx-4 px-6 py-8 text-3xl text-red-400"
          onClick={() => handleMenuClick(false)}
        >
          <IoMdClose />
        </div>
        <ol className="flex h-full max-sm:flex-col max-sm:gap-5">
          {[
            { name: "首页", link: "/" },
            { name: "城市", link: "/city" },
            { name: "展商", link: "/organization" },
            { name: "年份表", link: "/years" },
          ].map((nav) => (
            <li
              key={nav.name}
              className={clsx(
                "relative font-bold flex items-center mx-4 text-red-400 after:transition-all after:ease-out after:duration-300 hover:bg-red-2001 hover:text-white1 cursor-pointer after:absolute after:w-full after:content-[''] hover:after:h-2 after:h-0 after:bottom-0 after:bg-red-200 max-sm:rounded max-sm:text-right",
                pathname === nav.link && "after:h-2"
              )}
            >
              <Link
                className="flex justify-center px-6 py-2 h-full w-full flex-col max-sm:py-4"
                href={nav.link}
                onClick={() => handleMenuClick(false)}
              >
                {nav.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
