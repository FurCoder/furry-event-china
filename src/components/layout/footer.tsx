import { AboutUsLinks, FriendSiteLinks } from "@/constants/staticConfig";
import { sendTrack } from "@/utils/track";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useTranslation } from "next-i18next";

export default function Footer({ isCNRegion }: { isCNRegion: boolean }) {
  const dateString = format(LASTCOMMITDATETIME, "yyyy/MM/dd", { locale: zhCN });
  const { t } = useTranslation();

  return (
    <footer className="mt-8 bg-white rounded-t-xl p-6 text-sm text-center md:text-left">
      <h5 className="text-gray-600 mb-4 text-sm flex flex-col md:flex-row">
        <span className="font-bold mr-2">{t("header.title")}</span>
        <span className="">
          {isCNRegion ? "FURRYCONS.CN" : "FURRYEVENTCHINA.COM"} ©️
          {new Date().getFullYear()}
        </span>
      </h5>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <div>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mt-4 md:mt-0 text-center md:text-left md:mr-4">
              <h3 className="text-gray-700">{t("footer.friendsLink")}</h3>
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
              <h3 className="text-gray-700">{t("footer.aboutUs")}</h3>
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

        <div className="flex flex-col text-gray-700 text-center md:text-right text-xs mt-4 md:mt-0">
          <span className="block">{t("footer.disclaimer")}</span>
          <div className="mt-1 flex flex-col md:flex-row1 justify-center md:justify-end items-center md:items-end">
            <span className="flex items-center">
              {t("footer.use")}
              <img
                alt="smiling-face-with-hearts"
                src="/svgs/smiling-face-with-hearts.svg"
                className="w-6 mx-1"
                fetchPriority="low"
                loading="lazy"
                width={32}
                height={32}
              />
              {t("footer.and")}
              <img
                alt="steaming-bowl"
                src="/svgs/steaming-bowl.svg"
                className="w-6 mx-1"
                fetchPriority="low"
                loading="lazy"
                width={32}
                height={32}
              />
              {t("footer.made")}
            </span>
            {isCNRegion && (
              <span className="mt-2">
                <a href="https://beian.miit.gov.cn/" target="_blank">
                  渝ICP备18016662号-2
                </a>
              </span>
            )}
            <span className="ml-2" suppressHydrationWarning>
              build.{COMMITHASH} {dateString}
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
  const { t } = useTranslation();
  return (
    <section className="bg-white p-3 md:p-6 rounded-xl mt-8">
      <h3 className="font-bold text-gray-600 text-xl md:text-2xl">
        {t("footer.friendsLink")}
      </h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
            className="bg-white p-3 rounded-xl flex flex-col border group hover:border-red-300 hover:bg-red-300 transition duration-300 relative"
          >
            <h4 className="text-base md:text-lg font-bold mb-1 md:mb-3 transition duration-300 text-gray-600 group-hover:text-white decoration-transparent group-hover:decoration-current decoration-wavy">
              {link.label}
            </h4>
            <p className="text-sm group-hover:text-white transition duration-300 text-gray-600">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
