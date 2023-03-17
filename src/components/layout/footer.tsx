import { FaKissWinkHeart } from "react-icons/fa";

export default function Footer() {
  const friendsLink = [
    {
      link: "https://www.wilddream.net/?utm_source=fec",
      label: "WildDream创作站",
    },
    {
      link: "https://www.kemono.games/?utm_source=fec",
      label: "兽人控游戏库 Kemono.Games",
    },
    {
      link: "https://furcoder.org/?utm_source=fec",
      label: "FurCoder.org",
    },
  ];

  const dateString=new Date(LASTCOMMITDATETIME).toLocaleDateString()

  return (
    <footer className="flex flex-col md:flex-row md:justify-between items-center mt-20 bg-white rounded-t-xl p-6 text-sm">
      <div>
        <span className="block text-gray-600 md:text-left text-center">
          <span className="font-bold text-sm">毛茸茸展会目录</span>{" "}
          FURRYEVENTCHINA.COM ©️2023
        </span>
        <div className="mt-4 md:mt text-center md:text-left">
          {friendsLink.map((link) => (
            <FriendLink key={link.link} link={link.link} label={link.label} />
          ))}
        </div>
      </div>
      <div className="flex flex-col text-sm text-gray-700 text-center md:text-right text-xs mt-4 md:mt-0">
        <span className="block">
          本页所示信息仅供参考，准确信息请以活动官网为准
        </span>
        <div className="mt-1 flex justify-center md:justify-end items-center">
          由
          <FaKissWinkHeart className="inline-block text-xl text-red-400 mx-1" />
          和<span className="mx-1 text-xl">🍜</span>
          制作而成
          <span className="ml-2">build.{VERSION} {dateString}</span>
        </div>
      </div>
    </footer>
  );
}

function FriendLink({ label, link }: { label: string; link: string }) {
  return (
    <a
      className="mr-2 text-gray-400 underline hover:text-gray-600 transition inline-block"
      href={link}
      referrerPolicy="no-referrer"
    >
      {label}
    </a>
  );
}
