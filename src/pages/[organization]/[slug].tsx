import OrganizationStatus from "@/components/organizationStatus";
import { Event, XataClient } from "@/xata/xata";
import clsx from "clsx";
import { format } from "date-fns";
import { GetStaticPropsContext } from "next";
import NextImage from "@/components/image";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaQq, FaTwitter, FaWeibo } from "react-icons/fa";
import { HiOutlineHome, HiOutlineMail } from "react-icons/hi";
import { IoLocation } from "react-icons/io5";
import { SiBilibili } from "react-icons/si";
import { TbArrowsRightLeft } from "react-icons/tb";
import { FaPaw } from "react-icons/fa";
import Link from "next/link";
import { EventStatus, EventStatusSchema } from "@/types/event";
import { sendTrack } from "@/utils/track";

const xata = new XataClient();

export default function EventDetail({ event }: { event: Event }) {
  const [isWiderImage, setIsWiderImage] = useState(true);

  const calcImageRatio = useCallback(() => {
    if (!event.logoUrl) return;
    const img = new Image();
    img.src = event.logoUrl;
    img.onload = function (this) {
      setIsWiderImage(img.width >= img.height);
    };
  }, [event.logoUrl]);

  useEffect(() => {
    calcImageRatio();
  }, [calcImageRatio]);

  const finalEventCoverImage =
    event.logoUrl ||
    `https://cdn.furryeventchina.com/fec-event-default-cover.png`;

  return (
    <>
      <Toaster />
      <div
        className={clsx(
          "flex border bg-white rounded-xl min-h-[500px] overflow-hidden",
          isWiderImage && "flex-col",
          !isWiderImage && "lg:flex-row flex-col"
        )}
      >
        <div
          className={clsx(
            "event-detail__left",
            isWiderImage && "w-full h-[500px]",
            !isWiderImage && "lg:w-7/12 w-full h-[500px]"
          )}
          {...(isWiderImage
            ? {}
            : {
                style: {
                  backgroundImage: `url(${
                    finalEventCoverImage || event.coverUrl
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                },
              })}
        >
          {isWiderImage && finalEventCoverImage && (
            <div className="relative w-full h-[500px]">
              <NextImage
                priority
                src={finalEventCoverImage}
                className="object-cover w-full h-full"
                alt={`The event cover of ${event.name}`}
              />
            </div>
          )}
          {!isWiderImage && finalEventCoverImage && (
            <div
              className={clsx("text-center h-full")}
              style={{ backdropFilter: "blur(8px)" }}
            >
              <NextImage
                priority
                width={350}
                height={500}
                src={finalEventCoverImage}
                alt={`The event cover of ${event.name}`}
                className="mx-auto h-full object-contain"
              />
            </div>
          )}
        </div>
        <div
          className={clsx(
            "p-6 event-detail__right w-full sm1:w-5/12 flex",
            isWiderImage && "w-full flex-col sm:flex-row sm:items-end",
            !isWiderImage &&
              "lg:w-5/12 flex-col sm:flex-row sm:max-lg:items-end lg:flex-col"
          )}
        >
          <div className="flex-grow">
            <h1
              aria-label="活动名称"
              className="font-bold text-2xl text-gray-700"
            >
              {event.name}
            </h1>
            <h2 className="text-gray-600 text-sm">
              由 {event.organization?.name} 主办
            </h2>
            <p
              aria-label="活动举办地点"
              className="flex items-center text-gray-500 mt-4"
            >
              <IoLocation className="text-gray-500 inline-block mr-2" />
              {`${event.city} · ${event.address}`}
            </p>
            <p
              aria-label="活动时间"
              className="flex items-center text-gray-500"
            >
              <BsCalendar2DateFill className="text-gray-500 inline-block mr-2" />
              <time aria-label="活动开始时间" suppressHydrationWarning>
                {event.startDate
                  ? new Date(event.startDate).toLocaleDateString()
                  : null}
              </time>
              <TbArrowsRightLeft className="mx-2  text-sm" />
              <time aria-label="活动结束时间" suppressHydrationWarning>
                {event.endDate
                  ? new Date(event.endDate).toLocaleDateString()
                  : null}
              </time>
            </p>
          </div>

          {event.website && (
            <a
              href={event.website || "#"}
              target="_blank"
              rel="noreferrer"
              className="block mt-8 px-16 py-4 bg-red-400 text-white font-bold rounded-md text-center transition duration-300 border border-2 border-red-100 hover:border-red-400 shadow-lg"
            >
              前往信源
            </a>
          )}
        </div>
      </div>

      <div className="flex my-4 lg:items-start flex-col-reverse md:flex-row">
        {event.detail && (
          <div id="event-detail__left" className="md:w-8/12">
            <div className="bg-white rounded-xl flex-grow p-6 md:mr-4 mb-4">
              <p
                className="text-gray-600 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: event.detail }}
              />
            </div>

            {!!event.coverUrl?.length && (
              <div className="bg-white rounded-xl flex-grow p-6 md:mr-4">
                {event.coverUrl.map((cover, index) => (
                  <div className="relative" key={cover}>
                    <NextImage
                      alt={`${event.name}'s poster-${index}`}
                      src={cover}
                      width={600}
                      height={1000}
                      className="w-full"
                      priority
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          id="event-detail__right"
          className={clsx(
            "bg-white rounded-xl mb-4 lg:mb-0",
            !event.detail && "w-full",
            event.detail && "md:w-4/12"
          )}
        >
          <div className="p-4">
            <div className="flex">
              {event.organization?.logoUrl && (
                <div className="border rounded flex justify-center p-2 w-[100px] h-[100px]">
                  <NextImage
                    className="object-contain"
                    alt={`${event.organization?.name}'s logo`}
                    width={200}
                    height={200}
                    src={event.organization.logoUrl}
                  />
                </div>
              )}
              <div className="ml-4 flex flex-col justify-between">
                <div>
                  <Link
                    className="text-2xl font-bold text-gray-600"
                    target="_blank"
                    href={`/${event.organization?.slug}`}
                  >
                    {event.organization?.name}
                  </Link>
                  <div className="flex items-center text-gray-500 mb-4">
                    <span className="text-sm">
                      <OrganizationStatus
                        status={event.organization?.status || ""}
                      />
                    </span>
                  </div>
                </div>

                <button className="border rounded px-2 py-1 text-sm text-gray-500 hover:border-slate-400 hover:drop-shadow transition duration-200">
                  看看展商详情
                </button>
              </div>
            </div>

            <div
              className={clsx(
                "flex items-center text-gray-500 grid gap-4 mt-4",
                !event.detail && "lg:grid-cols-2"
              )}
            >
              {event.organization?.website && (
                <OrganizationLinkButton
                  href={event.organization?.website}
                  bgColorClass="bg-sky-400"
                  icon={<HiOutlineHome />}
                >
                  去官网
                </OrganizationLinkButton>
              )}
              {event.organization?.qqGroup && (
                <OrganizationLinkButton
                  bgColorClass="bg-[#4d9aff]"
                  icon={<FaQq />}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(event.organization?.qqGroup || "")
                      .then(() => toast.success("🥳 复制成功，快去QQ加群吧"));
                  }}
                  label="复制QQ群号"
                >
                  {event.organization?.qqGroup}
                </OrganizationLinkButton>
              )}
              {event.organization?.bilibili && (
                <OrganizationLinkButton
                  bgColorClass="bg-[#fb7299]"
                  href={event.organization?.bilibili}
                  icon={<SiBilibili />}
                >
                  去BiliBili
                </OrganizationLinkButton>
              )}
              {event.organization?.weibo && (
                <OrganizationLinkButton
                  bgColorClass="bg-[#ff5962]"
                  href={event.organization?.weibo}
                  icon={<FaWeibo />}
                >
                  去微博
                </OrganizationLinkButton>
              )}
              {event.organization?.twitter && (
                <OrganizationLinkButton
                  bgColorClass="bg-[#1da1f2]"
                  href={event.organization?.twitter}
                  icon={<FaTwitter />}
                >
                  去Twitter
                </OrganizationLinkButton>
              )}
              {event.organization?.contactMail && (
                <OrganizationLinkButton
                  bgColorClass="bg-emerald-500"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(event.organization?.contactMail || "")
                      .then(() => toast.success("🥳 复制成功，快去发邮件吧"));
                  }}
                  icon={<HiOutlineMail />}
                  label="复制邮件地址"
                >
                  {event.organization?.contactMail}
                </OrganizationLinkButton>
              )}

              {event.organization?.wikifur && (
                <OrganizationLinkButton
                  bgColorClass="bg-blue-800"
                  href={event.organization?.wikifur}
                  icon={<FaPaw />}
                >
                  去 Wikifur 了解更多
                </OrganizationLinkButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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

export async function getStaticPaths() {
  const events = await xata.db.event
    .select(["*", "organization.slug"])
    .getAll();
  return {
    paths: events.map((event) => ({
      params: { organization: event.organization?.slug, slug: event.slug },
    })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const event = await xata.db.event
    .filter({
      slug: context.params?.slug as string,
      "organization.slug": context.params?.organization as string,
    })
    .select(["*", "organization"])
    .getFirst();
  return {
    props: {
      event,
      headMetas: {
        title: `${event?.name} FEC·兽展日历`,
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于“${
          event?.name
        }”的详细信息：这是由“${
          event?.organization?.name
        }”举办的兽展，将于${format(
          event?.startDate!,
          "yyyy年MM月dd日"
        )}至${format(event?.endDate!, "yyyy年MM月dd日")}在“${event?.city}${
          event?.address
        }”举办，喜欢的朋友记得关注开始售票时间～`,
        url: `https://www.furryeventchina.com/${context.params?.organization}/${event?.slug}`,
        cover: event?.logoUrl || event?.coverUrl?.[0],
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
              name: event?.organization?.name,
              item: `https://www.furryeventchina.com/${context.params?.organization}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: event?.name,
            },
          ],
        },
        event: {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event?.name,
          startDate: event?.startDate,
          endDate: event?.endDate,
          eventStatus:
            EventStatusSchema[event?.status || EventStatus.EventScheduled],
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: event?.address,
            address: {
              "@type": "PostalAddress",
              streetAddress: event?.address,
              addressLocality: event?.city,
              // postalCode: "19019",
              // addressRegion: event?.city,
              addressCountry: "CN",
            },
          },
          image: [event?.logoUrl || event?.coverUrl?.[0]],
          description: event?.detail,
          // offers: {
          //   "@type": "Offer",
          //   url: "https://www.example.com/event_offer/12345_201803180430",
          //   price: "30",
          //   priceCurrency: "USD",
          //   availability: "https://schema.org/InStock",
          //   validFrom: "2024-05-21T12:00",
          // },
          // performer: {
          //   "@type": "PerformingGroup",
          //   name: "Kira and Morrison",
          // },
          organizer: {
            "@type": "Organization",
            name: event?.organization?.name,
            url: `https://www.furryeventchina.com/${context.params?.organization}`,
          },
        },
        imageObject: [
          ...(event?.logoUrl ? [event.logoUrl] : []),
          ...(event?.coverUrl || []),
        ].map((image) => ({
          "@context": "https://schema.org/",
          "@type": "ImageObject",
          contentUrl: image,
          creditText: event?.organization?.name,
          creator: {
            "@type": "Organization",
            name: event?.organization?.name,
          },
          copyrightNotice: event?.organization?.name,
        })),
      },
    },
  };
}
