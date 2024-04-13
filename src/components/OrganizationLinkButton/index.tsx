import { sendTrack } from "@/utils/track";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaPaw } from "react-icons/fa";
import { HiOutlineHome, HiOutlineMail } from "react-icons/hi";
import { FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";

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

export const WebsiteButton = ({ href }: { href: string }) => (
  <OrganizationLinkButton
    href={href}
    bgColorClass="bg-sky-400"
    icon={<HiOutlineHome />}
  >
    去官网
  </OrganizationLinkButton>
);

export const QQGroupButton = ({ text }: { text: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#4d9aff]"
    icon={<FaQq />}
    onClick={() => {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("🥳 复制成功，快去QQ加群吧"));
    }}
    label="复制QQ群号"
  >
    {text}
  </OrganizationLinkButton>
);

export const BiliButton = ({ href }: { href: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#fb7299]"
    href={href}
    icon={<SiBilibili />}
  >
    去BiliBili
  </OrganizationLinkButton>
);

export const WeiboButton = ({ href }: { href: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#ff5962]"
    href={href}
    icon={<FaWeibo />}
  >
    去微博
  </OrganizationLinkButton>
);

export const TwitterButton = ({ href }: { href: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-[#1da1f2]"
    href={href}
    icon={<FaTwitter />}
  >
    去Twitter
  </OrganizationLinkButton>
);

export const EmailButton = ({ mail }: { mail: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-emerald-500"
    onClick={() => {
      navigator.clipboard
        .writeText(mail)
        .then(() => toast.success("🥳 复制成功，快去发邮件吧"));
    }}
    icon={<HiOutlineMail />}
    label="复制邮件地址"
  >
    {mail}
  </OrganizationLinkButton>
);

export const WikifurButton = ({ href }: { href: string }) => (
  <OrganizationLinkButton
    bgColorClass="bg-blue-800"
    href={href}
    icon={<FaPaw />}
  >
    去 Wikifur 了解更多
  </OrganizationLinkButton>
);

export default OrganizationLinkButton;
