import { MdRamenDining } from "react-icons/md";
import { FaKissWinkHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-between items-center mt-20 bg-white rounded-t-xl p-6 text-sm">
      <div>
        <span className="block text-gray-600">
          <span className="font-bold text-sm">毛茸茸展会目录</span>{" "}
          FURRYEVENTCHINA.COM ©️2023
        </span>
        <div className="mt">
          <a
            href="https://www.wilddream.net/?utm_source=fec"
            className="text-gray-400 underline hover:text-gray-600 transition"
            aria-details="兽、兽人、动物、奇幻生物主题艺术社群"
          >
            WildDream创作站
          </a>
          <a
            className="text-gray-400 ml-2 underline hover:text-gray-600 transition"
            href="https://www.kemono.games/?utm_source=fec"
          >
            兽人控游戏库 Kemono.Games
          </a>
          <a
            className="ml-2 text-gray-400 underline hover:text-gray-600 transition"
            href="https://furcoder.org/?utm_source=fec"
          >
            FurCoder.org
          </a>
        </div>
      </div>
      <div className="flex flex-col text-sm text-gray-700 text-right text-xs">
        <span className="block">
          本页所示信息仅供参考，准确信息请以活动官网为准
        </span>
        <div className="mt-1 flex justify-end items-center">
          由
          <FaKissWinkHeart className="inline-block text-xl text-red-400 mx-1" />
          和<span className="mx-1 text-xl">🍜</span>
          {/* <MdRamenDining className="inline-block text-xl text-amber-400" /> */}
          制作而成
          <span className="ml-2">build.1</span>
        </div>
      </div>
    </footer>
  );
}
