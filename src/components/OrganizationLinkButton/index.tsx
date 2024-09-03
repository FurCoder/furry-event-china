import { sendTrack } from "@/utils/track";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaPaw } from "react-icons/fa";
import { HiOutlineHome, HiOutlineMail } from "react-icons/hi";
import { FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";
import { TFunction } from "next-i18next";

function OrganizationLinkButton({
  icon,
  children,
  href,
  onClick,
  bgColorClass,
  label,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  bgColorClass?: string;
  label?: React.ReactNode;
}) {
  const className = clsx(
    "flex items-center rounded-xl px-4 py-3 text-white w-full text-left md:hover:-translate-x-2 shadow transition duration-300",
    bgColorClass
  );

  const track = () => {
    sendTrack({
      eventName: "click-event-portal",
      eventValue: {
        label,
        link: href,
        action: "click",
      },
    });
  };
  const buttonContext = (
    <>
      {icon && <span className="mr-2 flex-shrink-0 text-xl">{icon}</span>}
      {icon && <span className="h-[16px] w-[2px] bg-white mx-4 opacity-50" />}
      <div>
        {label && <span className="text-xs">{label}</span>}
        <p>{children}</p>
      </div>
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={track}
    >
      {buttonContext}
    </a>
  ) : (
    <button
      className={className}
      onClick={() => {
        onClick && onClick();
        track();
      }}
    >
      {buttonContext}
    </button>
  );
}

export const WebsiteButton = ({ href, t }: { href: string; t: TFunction }) => (
  <OrganizationLinkButton
    href={href}
    bgColorClass="bg-sky-400"
    icon={<HiOutlineHome />}
  >
    {t("organization.website")}
  </OrganizationLinkButton>
);

export const QQGroupButton = ({ text, t }: { text: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#4d9aff]"
    icon={<FaQq />}
    onClick={() => {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success(t("organization.qqCopySuccess")));
    }}
    label={t("organization.copyQq")}
  >
    {text}
  </OrganizationLinkButton>
);

export const BiliButton = ({ href, t }: { href: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#fb7299]"
    href={href}
    icon={<SiBilibili />}
  >
    {t("organization.bilibili")}
  </OrganizationLinkButton>
);

export const WeiboButton = ({ href, t }: { href: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#ff5962]"
    href={href}
    icon={<FaWeibo />}
  >
    {t("organization.weibo")}
  </OrganizationLinkButton>
);

export const TwitterButton = ({ href, t }: { href: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#1da1f2]"
    href={href}
    icon={<FaTwitter />}
  >
    {t("organization.twitter")}
  </OrganizationLinkButton>
);

export const EmailButton = ({ mail, t }: { mail: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-emerald-500"
    onClick={() => {
      navigator.clipboard
        .writeText(mail)
        .then(() => toast.success(t("organization.mailCopySuccess")));
    }}
    icon={<HiOutlineMail />}
    label={t("organization.copyMail")}
  >
    {mail}
  </OrganizationLinkButton>
);

export const WikifurButton = ({ href, t }: { href: string; t: TFunction }) => (
  <OrganizationLinkButton
    bgColorClass="bg-blue-800"
    href={href}
    icon={<FaPaw />}
  >
    {t("organization.wikifur")}
  </OrganizationLinkButton>
);

export default OrganizationLinkButton;
