import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const { pathname, query,route } = useRouter();
  return (
    <header className="mb-6 rounded-b-xl bg-white flex justify-between items-center1">
      <div className="m-6 text-4xl text-geraldine font-bold">
        <span className="block">FEC 🐺🐱🐯</span>
        <span className="text-base mt-0 block">
          毛茸茸展会目录
        </span>
      </div>
      <nav className="mr-6 hidden md:block">
        <ol className="flex h-full">
          {[
            { name: "首页", link: "/" },
            { name: "城市", link: "/city" },
            { name: "展商", link: "/organization" },
            { name: "年份表", link: "/years" },
          ].map((nav) => (
            <li
              key={nav.name}
              className="relative font-bold flex items-center mx-4 text-red-400 after:transition-all after:ease-out after:duration-300 hover:bg-red-2001 hover:text-white1 cursor-pointer after:absolute after:w-full after:content-[''] hover:after:h-2 after:h-0 after:bottom-0 after:bg-red-200"
            >
              <Link className="px-6 py-2 inline-block" href={nav.link}>
                {nav.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
