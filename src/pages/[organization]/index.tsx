import EventCard from "@/components/eventCard";
import OrganizationStatus from "@/components/organizationStatus";
import styles from "@/styles/Organization.module.css";
import { Event, Organization, XataClient } from "@/xata/xata";
import clsx from "clsx";
import Image from "next/image";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiBilibili } from "react-icons/si";

const xata = new XataClient();
export default function OrganizationDetail(props: {
  events: Event[];
  organization: Organization;
}) {
  const { organization, events } = props;

  const formatedCreationTime = useMemo(() => {
    if (organization.creationTime) {
      const date = new Date(organization.creationTime);

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    } else {
      return null;
    }
  }, [organization.creationTime]);

  return (
    <div>
      <Toaster />
      <div className="border bg-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row">
          {organization.logoUrl && (
            <div className="border rounded flex justify-center p-2 w-full md:w-80 md:h-80 h-48">
              <Image
                className="object-contain"
                alt={`${organization.name}'s logo`}
                width={200}
                height={200}
                src={organization.logoUrl}
              />
            </div>
          )}
          <div className="mt-4 md:mt-0 md:ml-4">
            <h1 className="text-2xl font-bold mb-2">{organization.name}</h1>

            <div className="flex items-center mb-2 text-gray-500">
              <OrganizationStatus status={organization.status} />
            </div>

            <div className={clsx("mb-2 text-gray-500", styles["intro-bar"])}>
              <span>已累计举办 {events.length} 场展会</span>
              {formatedCreationTime && (
                <span className="lex items-center">
                  {`首次举办于 ${formatedCreationTime?.year}年${formatedCreationTime?.month}月${formatedCreationTime?.day}日`}
                </span>
              )}
            </div>

            <div
              className={clsx(
                "flex items-center flex-wrap first:mr-0 gap-4",
                styles.links
              )}
            >
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-300 rounded-xl px-4 py-1 text-white"
                >
                  去官网
                </a>
              )}
              {organization?.qqGroup && (
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(organization?.qqGroup || "")
                      .then(() => toast.success("🥳 复制成功，快去QQ加群吧"));
                  }}
                  className="flex items-center justify-center bg-red-300 rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaQq className="mr-2" /> 复制QQ群号:
                  {organization?.qqGroup}
                </button>
              )}
              {organization?.bilibili && (
                <a
                  href={organization?.bilibili}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-sky-400 rounded-xl px-4 py-1 text-white text-center"
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
                  className="flex items-center justify-center bg-red-500 rounded-xl px-4 py-1 text-white text-center"
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
                  className="flex items-center justify-center bg-blue-500 rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaTwitter className="mr-2" />
                  去Twitter
                </a>
              )}
              {organization.contactMail && (
                <div className="flex items-center bg-green-600 rounded-xl px-4 py-1 text-white">
                  <a href={`mailto:${organization.contactMail}`}>
                    发邮件给 {organization.contactMail}
                  </a>
                  <div
                    onClick={() => {
                      navigator.clipboard
                        .writeText(organization.contactMail!)
                        .then(() => toast.success("🥳 复制成功，快去发邮件吧"));
                    }}
                    className="border-l pl-2 cursor-pointer"
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
          {organization.description}
        </p>
      </div>

      {!!events.length && (
        <section className="mt-8 grid gird-cols-1 gap-8 p-6 bg-white rounded-xl">
          <h2 className="text-xl text-slate-600 -mb-4">历届展会</h2>
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
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
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
  const dateString = date
    ? `${dateObj?.year}年${dateObj?.month}月${dateObj?.day}日`
    : "未知时间线";
  return {
    props: {
      organization,
      events,
      headMetas: {
        title: `${organization?.name} FEC·兽展日历`,
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于 ${organization?.name} 的有关信息，这家展商已累计举办 ${events.length} 场兽展，最近的一次在${dateString}，他们是这样介绍自己的“${organization?.description}”`,
        url: `https://www.furryeventchina.com/${organization?.slug}`,
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
  };
}
