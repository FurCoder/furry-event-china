import OrganizationStatus from "@/components/organizationStatus";
import { Event, XataClient } from "@/xata/xata";
import clsx from "clsx";
import { format } from "date-fns";
import { GetStaticPropsContext } from "next";
import NextImage from "@/components/image";
import { useState } from "react";
import { BsCalendar2DateFill } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";
import { IoLocation } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { TbArrowsRightLeft } from "react-icons/tb";
import Link from "next/link";
import { EventScaleLabel, EventStatus, EventStatusSchema } from "@/types/event";
import { sendTrack } from "@/utils/track";
import { getEventCoverUrl, imageUrl } from "@/utils/imageLoader";
import Script from "next/script";
import OrganizationLinkButton, {
  BiliButton,
  EmailButton,
  QQGroupButton,
  TwitterButton,
  WebsiteButton,
  WeiboButton,
  WikifurButton,
} from "@/components/OrganizationLinkButton";
import { keywordgenerator } from "@/utils/meta";
import { FaPeoplePulling } from "react-icons/fa6";

const xata = new XataClient();

const MapLoadingStatus = {
  Idle: "idle",
  Loading: "loading",
  Finished: "finished",
  Error: "error",
};

export default function EventDetail({ event }: { event: Event }) {
  const [mapLoadingStatus, setMapLoadingStatus] = useState(() => {
    if (event.addressLat && event.addressLon) {
      return MapLoadingStatus.Loading;
    }
    return MapLoadingStatus.Idle;
  });

  const finalEventCoverImage = getEventCoverUrl(event);

  const initMap = () => {
    if (!window.TMap) throw new Error("TMap is not loaded");
    setMapLoadingStatus(MapLoadingStatus.Loading);
    const center = new window.TMap.LatLng(event.addressLat, event.addressLon);
    //定义map变量，调用 TMap.Map() 构造函数创建地图

    try {
      const map = new window.TMap.Map(
        document.getElementById("event-map-container"),
        {
          center: center, //设置地图中心点坐标
          zoom: 17.2, //设置地图缩放级别
          pitch: 43.5, //设置俯仰角
          rotation: 45, //设置地图旋转角度
        }
      );

      map.on("tilesloaded", function () {
        setMapLoadingStatus(MapLoadingStatus.Finished);
      });

      new window.TMap.MultiMarker({
        id: "marker-layer", //图层id
        map: map,
        styles: {
          //点标注的相关样式
          marker: new window.TMap.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 16, y: 32 },
          }),
        },
        geometries: [
          {
            //点标注数据数组
            id: "demo",
            styleId: "marker",
            position: new window.TMap.LatLng(
              event.addressLat,
              event.addressLon
            ),
            properties: {
              title: "marker",
            },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      setMapLoadingStatus(MapLoadingStatus.Error);
    }
  };

  return (
    <>
      {mapLoadingStatus !== MapLoadingStatus.Idle && (
        <Script
          src="https://map.qq.com/api/gljs?v=1.exp&key=PXEBZ-QLM6C-RZX2K-AV2XX-SBBW5-VGFC4"
          strategy="lazyOnload"
          onReady={initMap}
        />
      )}

      <div
        className={clsx(
          "flex border bg-white rounded-xl min-h-[500px] overflow-hidden",
          "lg:flex-row flex-col"
        )}
      >
        <div
          className={clsx("event-detail__left", "lg:w-7/12 w-full h-[500px]")}
        >
          <div className={clsx("relative text-center h-full")}>
            <NextImage
              containerClassName="relative z-20"
              priority
              width={600}
              height={500}
              src={finalEventCoverImage}
              alt={`${event.name}的活动海报`}
              className="mx-auto h-full object-contain z-20 relative"
              autoFormat
            />

            <NextImage
              containerClassName="absolute top-0 left-0 w-full h-full z-10 blur brightness-50"
              width={600}
              height={500}
              src={finalEventCoverImage}
              alt={`${event.name}的活动海报`}
              className="mx-auto h-full w-full object-cover"
              autoFormat
            />
          </div>
        </div>
        <div
          className={clsx(
            "event-detail__right",
            "p-6 bg-white z-10 flex",
            "flex-col sm:flex-row sm:max-lg:items-end lg:flex-col",
            "w-full lg:w-5/12"
          )}
        >
          <div className="flex-grow">
            {event.status === EventStatus.EventCancelled && (
              <p className="inline-flex items-center bg-red-400 mb-2 px-4 py-2 text-white rounded-md">
                <RiErrorWarningLine className="mr-2 text-lg" />
                活动已被主办方取消，无法举行。
              </p>
            )}

            <h2
              aria-label="活动名称"
              className="font-bold text-3xl text-gray-700"
            >
              {event.name}
            </h2>
            <h2 className="text-gray-600 text-sm">
              由 {event.organization?.name} 主办
            </h2>

            <p
              aria-label="活动举办地点"
              className="flex items-center text-gray-500 mt-4"
            >
              <IoLocation className="text-gray-500 inline-block mr-2" />
              {`${event.city} · ${event.address ? event.address : "暂未公布"}`}
            </p>
            <p
              aria-label="活动时间"
              className="flex items-center text-gray-500"
            >
              <BsCalendar2DateFill className="text-gray-500 inline-block mr-2" />
              <time aria-label="活动开始时间" suppressHydrationWarning>
                {event.startDate
                  ? format(event.startDate, "yyyy年MM月dd日")
                  : "暂未公布"}
              </time>
              <TbArrowsRightLeft className="mx-2  text-sm" />
              <time aria-label="活动结束时间" suppressHydrationWarning>
                {event.endDate
                  ? format(event.endDate, "yyyy年MM月dd日")
                  : "暂未公布"}
              </time>
            </p>

            <p
              aria-label="活动规模"
              className="flex items-center text-gray-500"
            >
              <FaPeoplePulling className="text-gray-500 inline-block mr-2" />
              这是一个 {EventScaleLabel[event.scale]} 的兽展
            </p>

            {/* <p
              aria-label="活动规模"
              className="flex items-center text-gray-500"
            >
              <FaPeoplePulling className="text-gray-500 inline-block mr-2" />
              页面更新次数：{event.xata.version}
            </p> */}
          </div>

          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                sendTrack({
                  eventName: "click-event-website",
                  eventValue: {
                    eventName: event.name,
                    link: event.website,
                  },
                })
              }
              className="block mt-8 px-16 py-4 bg-red-400 text-white font-bold rounded-md text-center transition duration-300 border border-2 border-red-100 hover:border-red-400 shadow-lg"
            >
              前往信源
            </a>
          )}
        </div>
      </div>

      {mapLoadingStatus !== MapLoadingStatus.Idle && (
        <div className="my-4 bg-white rounded-xl overflow-hidden elative">
          <h3 className="text-xl text-gray-600 m-4">展会地图</h3>

          <div
            id="event-map-container"
            className="h-[450px] overflow-hidden rounded-2xl m-4 relative"
          >
            <div
              className={clsx(
                "absolute w-full bg-gray-100/70 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center overflow-hidden transition duration-300",
                mapLoadingStatus === MapLoadingStatus.Loading && "h-full",
                mapLoadingStatus !== MapLoadingStatus.Loading && "h-0"
              )}
            >
              <div className="flex items-center z-10 abosolute">
                <span className="animate-spin mr-2">
                  <VscLoading className="text-base" />
                </span>
                <label className="text-gray-600">正在加载地图</label>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2 mb-4 px-4">
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://uri.amap.com/marker?position=${event.addressLon},${event.addressLat}`}
              className="px-2 py-2 border border-gray-300 text-sm rounded text-gray-700 hover:text-gray-900 hover:border-gray-400 transition duration-300"
            >
              去高德地图查看
            </a>
          </div>
        </div>
      )}

      <div className="flex my-4 lg:items-start flex-col-reverse md:flex-row">
        {event.detail && (
          <div id="event-detail__left" className="md:w-8/12">
            <div className="bg-white rounded-xl flex-grow p-6 md:mr-4 mb-4">
              <p
                className="text-gray-600 whitespace-pre-line break-words"
                dangerouslySetInnerHTML={{ __html: event.detail }}
              />
            </div>

            {!!event.posterUrl?.length && (
              <div className="bg-white rounded-xl flex-grow p-6 md:mr-4">
                {event.posterUrl.map((cover, index) => (
                  <div className="relative" key={cover}>
                    <NextImage
                      alt={`${event.name}的详情图片-${index + 1}`}
                      src={cover}
                      width={600}
                      className="w-full"
                      priority
                      autoFormat
                      quality={90}
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
                    autoFormat
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

                <Link href={`/${event.organization?.slug}`}>
                  <button
                    onClick={() =>
                      sendTrack({
                        eventName: "click-event-portal",
                        eventValue: {
                          link: `/${event.organization?.slug}`,
                        },
                      })
                    }
                    className="border rounded px-2 py-1 text-sm text-gray-500 hover:border-slate-400 hover:drop-shadow transition duration-200"
                  >
                    看看展商详情
                  </button>
                </Link>
              </div>
            </div>

            <div
              className={clsx(
                "flex items-center text-gray-500 grid gap-4 mt-4",
                !event.detail && "lg:grid-cols-2"
              )}
            >
              {event.organization?.website && (
                <WebsiteButton href={event.organization.website} />
              )}
              {event.organization?.qqGroup && (
                <QQGroupButton text={event.organization.qqGroup} />
              )}
              {event.organization?.bilibili && (
                <BiliButton href={event.organization.bilibili} />
              )}

              {event.organization?.weibo && (
                <WeiboButton href={event.organization.weibo} />
              )}

              {event.organization?.twitter && (
                <TwitterButton href={event.organization.twitter} />
              )}

              {event.organization?.contactMail && (
                <EmailButton mail={event.organization.contactMail} />
              )}

              {event.organization?.wikifur && (
                <WikifurButton href={event.organization.wikifur} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
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

  if (!event) {
    return {
      notFound: true,
    };
  }

  const metaDes =
    event?.startDate && event.endDate
      ? `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于“${
          event?.name
        }”的详细信息：这是由“${
          event?.organization?.name
        }”举办的兽展，将于${format(
          event?.startDate!,
          "yyyy年MM月dd日"
        )}至${format(event?.endDate!, "yyyy年MM月dd日")}在“${event?.city}${
          event?.address
        }”举办，喜欢的朋友记得关注开始售票时间～`
      : `欢迎来到FEC·兽展日历！FEC·兽展日历提供关于“${event?.name}”的详细信息：这是由“${event?.organization?.name}”举办的兽展，将在“${event?.city}${event?.address}”举办，喜欢的朋友记得关注开始售票时间～`;

  return {
    props: {
      event,
      headMetas: {
        title: `${event?.name}-${event?.organization?.name}`,
        keywords: keywordgenerator({
          page: "event",
          event: {
            name: event?.name,
            startDate: event?.startDate,
            city: event?.city,
          },
        }),
        des: metaDes,
        url: `https://www.furryeventchina.com/${context.params?.organization}/${event?.slug}/`,
        cover: imageUrl(
          event?.coverUrl ||
            event?.posterUrl?.[0] ||
            "https://images.furrycons.cn/fec-event-default-cover.png"
        ),
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
              item: `https://www.furryeventchina.com/${context.params?.organization}/`,
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
          image: [
            imageUrl(
              event?.coverUrl ||
                event?.posterUrl?.[0] ||
                "https://images.furrycons.cn/fec-event-default-cover.png"
            ),
          ],
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
            url: `https://www.furryeventchina.com/${context.params?.organization}/`,
          },
        },
        imageObject: [
          ...(event?.coverUrl ? [event.coverUrl] : []),
          ...(event?.posterUrl || []),
        ].map((image) => ({
          "@context": "https://schema.org/",
          "@type": "ImageObject",
          contentUrl: imageUrl(image),
          creditText: event?.organization?.name,
          creator: {
            "@type": "Organization",
            name: event?.organization?.name,
          },
          copyrightNotice: event?.organization?.name,
          license: "https://creativecommons.org/licenses/by-nc/4.0/",
          acquireLicensePage: "https://docs.furryeventchina.com/blog/about",
        })),
      },
    },
    revalidate: 86400,
  };
}
