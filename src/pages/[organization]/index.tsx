import EventCard from "@/components/eventCard";
import OrganizationStatus from "@/components/organizationStatus";
import styles from "@/styles/Organization.module.css";
import { Event, Organization, XataClient } from "@/xata/xata";
import clsx from "clsx";
import Image from "@/components/image";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FaPaw, FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiBilibili } from "react-icons/si";
import { formatDistanceToNowStrict } from "date-fns";
import { zhCN } from "date-fns/locale";
// import {
//   WebsiteButton,
//   QQGroupButton,
//   BiliButton,
//   WeiboButton,
//   TwitterButton,
//   EmailButton,
//   WikifurButton,
// } from "@/components/OrganizationLinkButton";

const xata = new XataClient();
export default function OrganizationDetail(props: {
  events: Event[];
  organization: Organization;
}) {
  const { organization, events } = props;

  const foramtedFirstEventTime = useMemo(() => {
    const theBeginningEvent = events[events.length - 1];
    if (theBeginningEvent && theBeginningEvent.startDate) {
      const date = new Date(theBeginningEvent.startDate);

      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
      };
    }

    return null;
  }, [events]);

  const formatedCreationTime = useMemo(() => {
    if (organization.creationTime) {
      const date = new Date(organization.creationTime);

      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        createDistance: formatDistanceToNowStrict(date, { locale: zhCN }),
      };
    } else {
      return null;
    }
  }, [organization.creationTime]);

  return (
    <div>
      <div className="border bg-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row">
          {organization.logoUrl && (
            <div className="border rounded flex justify-center p-2 w-full md:w-48 md:h-48 h-48 shrink-0">
              <Image
                className="object-contain h-full"
                containerClassName="h-full"
                alt={`${organization.name}的展会徽标`}
                width={200}
                height={200}
                src={organization.logoUrl}
                autoFormat
              />
            </div>
          )}
          <div className="mt-4 md:mt-0 md:ml-4 ">
            <h2 className="text-2xl font-bold mb-2">{organization.name}</h2>

            <div className="flex items-center mb-2 text-gray-500">
              <OrganizationStatus status={organization.status} />
            </div>

            <div className={clsx("mb-2 text-gray-500", styles["intro-bar"])}>
              {formatedCreationTime && (
                <span>已创立 {formatedCreationTime.createDistance}</span>
              )}
              <span>已累计收录 {events.length} 场展会</span>
              {foramtedFirstEventTime && (
                <span>
                  {`首次举办于 ${foramtedFirstEventTime?.year}年${foramtedFirstEventTime?.month}月${foramtedFirstEventTime?.day}日`}
                </span>
              )}
              {formatedCreationTime && (
                <span>{`首次出现于 ${formatedCreationTime?.year}年${formatedCreationTime?.month}月${formatedCreationTime?.day}日`}</span>
              )}
            </div>

            <div
              className={clsx(
                "flex items-center flex-wrap first:mr-0 gap-4"
                // styles.links
              )}
            >
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-300 hover:bg-blue-400 transition rounded-xl px-4 py-1 text-white"
                >
                  去官网
                </a>
              )}

              {organization?.bilibili && (
                <a
                  href={organization?.bilibili}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-sky-400 hover:bg-sky-500 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <SiBilibili className="mr-2" />
                  去Bilibili
                </a>
              )}
              {organization?.weibo && (
                <a
                  href={organization?.weibo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaWeibo className="mr-2" />
                  去微博
                </a>
              )}

              {organization?.twitter && (
                <a
                  href={organization?.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaTwitter className="mr-2" />
                  去Twitter
                </a>
              )}

              {organization?.wikifur && (
                <a
                  href={organization?.wikifur}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaPaw className="mr-2" />去 Wikifur 了解更多
                </a>
              )}

              {organization?.qqGroup && (
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(organization?.qqGroup || "")
                      .then(() => toast.success("🥳 复制成功，快去QQ加群吧"));
                  }}
                  className="flex items-center justify-center bg-red-300 hover:bg-red-400 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaQq className="mr-2" /> 复制QQ群号:
                  {organization?.qqGroup}
                </button>
              )}

              {organization.contactMail && (
                <div className="flex items-center bg-green-600 hover:bg-green-700 transition rounded-xl px-4 py-1 text-white">
                  <a href={`mailto:${organization.contactMail}`}>
                    发邮件给 {organization.contactMail}
                  </a>
                  <div
                    onClick={() => {
                      navigator.clipboard
                        .writeText(organization.contactMail!)
                        .then(() => toast.success("🥳 复制成功，快去发邮件吧"));
                    }}
                    className="border-l ml-2 pl-2 cursor-pointer"
                  >
                    <MdOutlineContentCopy />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t my-8" />
        <h2 className="text-xl text-slate-600 mb-4">展会简介</h2>
        <p className="text-slate-700 whitespace-pre-line">
          {organization.description || "这个主办方很懒，什么介绍也没写过。"}
        </p>
      </div>

      {/* <div
        className={clsx(
          "mt-8 p-6 bg-white rounded-xl border",
          "grid gird-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-8",
          styles.links
        )}
      >
        {organization?.website && <WebsiteButton href={organization.website} />}
        {organization?.qqGroup && <QQGroupButton text={organization.qqGroup} />}
        {organization?.bilibili && <BiliButton href={organization.bilibili} />}

        {organization?.weibo && <WeiboButton href={organization.weibo} />}

        {organization?.twitter && <TwitterButton href={organization.twitter} />}

        {organization?.contactMail && (
          <EmailButton mail={organization.contactMail} />
        )}

        {organization?.wikifur && <WikifurButton href={organization.wikifur} />}
      </div> */}

      {!!events.length && (
        <section className="mt-8 p-6 bg-white rounded-xl border">
          <h2 className="text-xl text-slate-600 mb-4">历届展会</h2>
          <div className="grid gird-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                sizes="(max-width: 750px)750px, (max-width: 1080px) 1080px, (min-width: 1200px) 1200px, 1200px"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const organizations = await xata.db.organization.select(["*"]).getAll();
  return {
    paths: organizations.map((organization) => ({
      params: { organization: organization.slug },
    })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const organizationPromise = xata.db.organization
    .filter({
      slug: context.params?.organization as string,
    })
    .select(["*"])
    .getFirst();

  const eventPromise = xata.db.event
    .filter({
      "organization.slug": context.params?.organization as string,
    })
    .select(["*", "organization.name", "organization.slug"])
    .sort("startDate", "desc")
    .getAll();

  const [organization, events] = await Promise.all([
    organizationPromise,
    eventPromise,
  ]);

  const date = events?.[0]?.startDate && new Date(events[0].startDate);
  const dateObj = date && {
    year: date.getFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
  const dateString = date
    ? `${dateObj?.year}年${dateObj?.month}月${dateObj?.day}日`
    : "未知时间线";

  if (!organization) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      organization,
      events,
      headMetas: {
        title: `${organization?.name}`,
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于 ${
          organization?.name
        } 的有关信息，这家展商已累计举办 ${
          events.length
        } 场兽展，最近的一场在${dateString}，${
          organization?.description
            ? `他们是这样介绍自己的：“${organization?.description}”。`
            : "不过他们没怎么介绍自己。"
        }`,
        keywords: `${organization?.name}, ${organization?.name} 兽展, ${organization?.name} 兽聚`,
        url: `https://www.furryeventchina.com/${organization?.slug}/`,
        cover: organization?.logoUrl,
      },
      structuredData: {
        breadcrumb: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "展商",
              item: "https://www.furryeventchina.com/organization/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: organization?.name,
            },
          ],
        },
      },
    },
    revalidate: 86400,
  };
}
