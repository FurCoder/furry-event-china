import EventCard from "@/components/eventCard";
import OrganizationStatus from "@/components/organizationStatus";
import styles from "@/styles/Organization.module.css";
import { Organization } from "@/xata/xata";
import clsx from "clsx";
import Image from "@/components/image";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FaPaw, FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiBilibili } from "react-icons/si";
import { formatDistanceToNowStrict, isBefore } from "date-fns";
import { zhCN } from "date-fns/locale";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import wfetch from "@/api";
import { z } from "zod";
import { format } from "date-fns";
import { EventType } from "@/types/event";
// import {
//   WebsiteButton,
//   QQGroupButton,
//   BiliButton,
//   WeiboButton,
//   TwitterButton,
//   EmailButton,
//   WikifurButton,
// } from "@/components/OrganizationLinkButton";

export default function OrganizationDetail(props: {
  events: EventType[];
  organization: Organization;
}) {
  const { t } = useTranslation();
  const { organization, events } = props;

  const formattedFirstEventTime = useMemo(() => {
    const theBeginningEvent = events[events.length - 1];
    if (theBeginningEvent && theBeginningEvent.startAt) {
      const date = new Date(theBeginningEvent.startAt);

      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
      };
    }

    return null;
  }, [events]);

  const formattedCreationTime = useMemo(() => {
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
              {formattedCreationTime && (
                <span>
                  {t("organization.createdAt", {
                    distance: formattedCreationTime.createDistance,
                  })}
                </span>
              )}
              <span>
                {t("organization.totalEvent", { amount: events.length })}
              </span>
              {formattedFirstEventTime && (
                <span>
                  {t("organization.firstTimeEvent", {
                    year: formattedFirstEventTime?.year,
                    month: formattedFirstEventTime?.month,
                    day: formattedFirstEventTime?.day,
                  })}
                </span>
              )}

              {formattedCreationTime && (
                <span>
                  {t("organization.firstTimeShow", {
                    year: formattedCreationTime?.year,
                    month: formattedCreationTime?.month,
                    day: formattedCreationTime?.day,
                  })}
                </span>
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
                  {t("organization.website")}
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
                  {t("organization.bilibili")}
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
                  {t("organization.weibo")}
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
                  {t("organization.twitter")}
                </a>
              )}

              {organization?.wikifur && (
                <a
                  href={organization?.wikifur}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaPaw className="mr-2" />
                  {t("organization.wikifur")}
                </a>
              )}

              {organization?.qqGroup && (
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(organization?.qqGroup || "")
                      .then(() =>
                        toast.success(t("organization.qqCopySuccess"))
                      );
                  }}
                  className="flex items-center justify-center bg-red-300 hover:bg-red-400 transition rounded-xl px-4 py-1 text-white text-center"
                >
                  <FaQq className="mr-2" />
                  {t("organization.qq", { qq: organization?.qqGroup })}
                </button>
              )}

              {organization.contactMail && (
                <div className="flex items-center bg-green-600 hover:bg-green-700 transition rounded-xl px-4 py-1 text-white">
                  <a href={`mailto:${organization.contactMail}`}>
                    {t("organization.mail", {
                      email: organization.contactMail,
                    })}
                  </a>
                  <div
                    onClick={() => {
                      navigator.clipboard
                        .writeText(organization.contactMail!)
                        .then(() =>
                          toast.success(t("organization.mailCopySuccess"))
                        );
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
        <h2 className="text-xl text-slate-600 mb-4">{t("organization.des")}</h2>
        <p className="text-slate-700 whitespace-pre-line">
          {organization.description || t("organization.defaultDes")}
        </p>
      </div>

      {!!events.length && (
        <section className="mt-8 p-6 bg-white rounded-xl border">
          <h2 className="text-xl text-slate-600 mb-4">
            {t("organization.passedEvent")}
          </h2>
          <div className="grid gird-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                sizes="(max-width: 750px)750px, (max-width: 1080px) 1080px, (min-width: 1200px) 1200px, 1200px"
                fallbackWidth={1200}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const organizations = await wfetch.get("/organization/all").json();

  const organizationSchema = z.array(
    z.object({
      slug: z.string().min(1),
    })
  );

  const validOrganizations = organizationSchema.safeParse(organizations);

  return {
    paths: validOrganizations?.data?.map((organization) => ({
      params: { organization: organization.slug },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const response = await wfetch
    .query({ slug: context.params?.organization })
    .get("/organization/detail")
    .json();

  const organizationSchema = z.object({
    id: z.string().uuid(), // 假设 id 是一个 UUID
    slug: z.string().min(1), // slug 至少有一个字符
    name: z.string().min(1), // name 至少有一个字符
    description: z.string().nullable(), // description 至少有一个字符
    status: z.enum(["active", "inactive"]), // 假设 status 只能是 'active' 或 'inactive'
    type: z.string().nullable(), // type 可以是字符串或 null
    logoUrl: z.string().nullable(), // logoUrl 应该是一个有效的 URL
    richMediaConfig: z.any().nullable(), // richMediaConfig 可以是任意类型或 null
    contactMail: z.string().email().nullable(), // contactMail 应该是一个有效的邮箱地址
    website: z.string().url().nullable(), // website 应该是一个有效的 URL
    twitter: z.string().url().nullable(), // twitter 可以是有效的 URL 或 null
    weibo: z.string().url().nullable(), // weibo 可以是有效的 URL 或 null
    qqGroup: z.string().nullable(), // qqGroup 可以是字符串或 null
    bilibili: z.string().url().nullable(), // bilibili 可以是有效的 URL 或 null
    wikifur: z.string().url().nullable(), // wikifur 可以是有效的 URL 或 null
    creationTime: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .nullable(), // creationTime 应该是一个有效的日期字符串
  });

  const eventSchema = z.object({
    name: z.string(),
    address: z.string().nullable(),
    addressExtra: z.object({ city: z.string().nullable() }).nullable(),
    thumbnail: z.string().nullable(),
    startAt: z.string().datetime().nullable(),
    endAt: z.string().datetime().nullable(),
    slug: z.string(),
  });

  const validResult = z
    .object({
      organization: organizationSchema,
      events: z.array(eventSchema),
    })
    .safeParse(response);

  const validOrganization = validResult.data?.organization;
  const validEvents = validResult.data?.events
    ?.map((e) => ({
      ...e,
      organization: {
        name: validOrganization?.name,
        slug: validOrganization?.slug,
        logoUrl: validOrganization?.logoUrl,
      },
    }))
    .sort((a, b) => {
      if (a.startAt && b.startAt) {
        return isBefore(a.startAt, b.startAt) ? 1 : -1;
      }
      return 0;
    });

  const dateString = validEvents?.[0].startAt
    ? format(validEvents?.[0].startAt, "yyyy年MM月dd日")
    : "未知时间线";

  if (!response) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      organization: validOrganization,
      events: validEvents,
      headMetas: {
        title: `${validOrganization?.name}`,
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于 ${
          validOrganization?.name
        } 的有关信息，这家展商已累计举办 ${
          validEvents?.length
        } 场兽展，最近的一场在${dateString}，${
          validOrganization?.description
            ? `他们是这样介绍自己的：“${validOrganization?.description}”。`
            : "不过他们没怎么介绍自己。"
        }`,
        keywords: `${validOrganization?.name}, ${validOrganization?.name} 兽展, ${validOrganization?.name} 兽聚`,
        url: `https://www.furryeventchina.com/${validOrganization?.slug}`,
        cover: validOrganization?.logoUrl,
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
              name: validOrganization?.name,
            },
          ],
        },
      },
      ...(context.locale
        ? await serverSideTranslations(context.locale, ["common"])
        : {}),
    },
    revalidate: 86400,
  };
}
