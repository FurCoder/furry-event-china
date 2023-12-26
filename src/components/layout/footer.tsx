import { AboutUsLinks, FriendSiteLinks } from "@/constants/staticConfig";
import { sendTrack } from "@/utils/track";
import Link from "next/link";
import { FaKissWinkHeart } from "react-icons/fa";

export default function Footer({ isEnableCN }: { isEnableCN: boolean }) {
  const dateString = new Date(LASTCOMMITDATETIME).toLocaleDateString();

  return (
    <footer className="mt-8 bg-white rounded-t-xl p-6 text-sm text-center md:text-left">
      <h5 className="block text-gray-600 mb-4 text-sm flex flex-col md:flex-row">
        <span className="font-bold mr-2">毛茸茸展会目录</span>
        <span className="">
          FURRYEVENTCHINA.COM ©️{new Date().getFullYear()}
        </span>
      </h5>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mt-4 md:mt-0 text-center md:text-left md:mr-4">
              <h3>友情链接</h3>
              <div className="flex flex-col">
                {FriendSiteLinks.map((link) => (
                  <FriendLink
                    key={link.link}
                    link={link.link}
                    label={link.label}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h3>关于我们</h3>
              <ul className="flex flex-col">
                {AboutUsLinks.map((link) => (
                  <li key={link.link}>
                    <FriendLink
                      key={link.link}
                      link={link.link}
                      label={link.label}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-sm text-gray-700 text-center md:text-right text-xs mt-4 md:mt-0">
          <span className="block">
            本页所示信息仅供参考，准确信息请以活动官网为准
          </span>
          <div className="mt-1 flex flex-col md:flex-row1 justify-center md:justify-end items-center md:items-end">
            <span className="flex items-center">
              由
              <FaKissWinkHeart className="inline-block text-xl text-red-400 mx-1" />
              和<span className="mx-1 text-xl">🍜</span>
              制作而成
            </span>
            {isEnableCN && (
              <span className="mt-2">
                <a href="https://beian.miit.gov.cn/" target="_blank">
                  渝ICP备18016662号-2
                </a>
              </span>
            )}
            <span className="ml-2" suppressHydrationWarning>
              build.{VERSION} {dateString}
            </span>
          </div>
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
      onClick={() =>
        sendTrack({
          eventName: "click-footer-link",
          eventValue: {
            href: link,
          },
        })
      }
    >
      {label}
    </a>
  );
}

export function FriendSiteBlock() {
  return (
    <section className="bg-white p-6 rounded-xl mt-8 mx-1 lg:mx-0">
      <h3 className="font-bold text-gray-600 text-2xl">友情链接</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {FriendSiteLinks.map((link) => (
          <Link
            href={link.link}
            key={link.link}
            onClick={() =>
              sendTrack({
                eventName: "click-index-friend-link",
                eventValue: {
                  href: link,
                },
              })
            }
            className="bg-white p-6 rounded-xl flex items-center justify-center border group hover:border-red-300 transition duration-300 relative"
          >
            <h4 className="transition duration-300 text-center text-gray-600 group-hover:text-red-300 underline decoration-transparent group-hover:decoration-current decoration-wavy underline-offset-4">
              {link.label}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
