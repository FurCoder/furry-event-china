import { sendTrack } from "@/utils/track";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

// const AnimeEmojis = [
//   "tiger-face",
//   "wolf",
//   "lion",
//   "dog-face",
//   "fox",
//   "leopard",
//   "bison",
//   "ox",
//   "cow",
//   "water-buffalo",
//   "cow-face",
//   "boar",
//   "elephant",
//   "mammoth",
//   "rhinoceros",
//   "hippopotamus",
//   "shark",
//   "seal",
//   "dolphin",
//   "whale",
//   "spouting",
//   "dragon",
//   "crocodile",
//   "parrot",
//   "owl",
//   "eagle",
//   "dove",
//   "penguin",
//   "bird",
//   "paw",
//   "badger",
//   "skunk",
//   "langaroo",
//   "otter",
//   "sloth",
//   "panda",
//   "koala",
//   "polar-bear",
//   "bear",
// ].map((emojiName) => (
//   <span key={emojiName} className={`icon-[fluent-emoji--${emojiName}]`} />
// ));

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
    <header className="mb-6 rounded-b-xl bg-white flex justify-between max-sm:sticky max-sm:top-0 max-sm:z-[9999] max-sm:shadow">
      <Link href="/">
        <div className="m-2 md:m-6 text-base md:text-4xl text-geraldine font-bold">
          <div className="flex items-center">
            <span className="">FEC</span>
            {/* <span className="ml-2 text-2xl">🐺🦁🐯</span> */}
            <span className="ml-2 text-4xl flex items-center">
              {/* <span
                key={"tiger-face"}
                className={`icon-[fluent-emoji--tiger-face]`}
              /> */}
              <img
                alt="title-emoji"
                src="/svgs/tiger-face.svg"
                width={32}
                height={32}
                //@ts-ignore
                fetchPriority="low"
              />
              <img
                alt="title-emoji"
                src="/svgs/wolf.svg"
                width={32}
                height={32}
                //@ts-ignore
                fetchPriority="low"
              />
              <img
                alt="title-emoji"
                src="/svgs/lion.svg"
                width={32}
                height={32}
                //@ts-ignore
                fetchPriority="low"
              />
              {/* <span key={"wolf"} className={`icon-[fluent-emoji--wolf]`} /> */}
              {/* <span key={"lion"} className={`icon-[fluent-emoji--lion]`} /> */}
            </span>
          </div>
          <div className="flex">
            <h1 className="text-base mt-0">FEC·兽展日历</h1>
            <span className="text-base mx-1">/</span>
            {/* <span className="text-base">五一五一🥳</span> */}
            <span className="text-base">展后综合征治疗中🤤</span>
          </div>
        </div>
      </Link>

      <div
        className="block sm:hidden flex align-end justify-end mx-4 md:px-6 md:py-8 text-3xl text-red-400 items-center"
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
                onClick={() => {
                  handleMenuClick(false);
                  sendTrack({
                    eventName: "click-nav-link",
                    eventValue: {
                      href: nav.link,
                    },
                  });
                }}
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
