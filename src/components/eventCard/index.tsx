import { Event } from "@/xata/xata";
import Link from "next/link";
import React from "react";
import styles from "@/components/eventCard/index.module.css";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import Image from "@/components/image";
import clsx from "clsx";
import { sendTrack } from "@/utils/track";
import { getEventCoverUrl } from "@/utils/imageLoader";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function EventCard({
  event,
  sizes,
}: {
  event: Event;
  sizes?: string;
}) {

  const finalEventCoverImage = getEventCoverUrl(event);
  const isDefaultCover = finalEventCoverImage.includes(
    "fec-event-default-cover"
  );

  return (
    <Link
      href={`/${event.organization?.slug}/${event.slug}`}
      onClick={() =>
        sendTrack({
          eventName: "click-event-card",
          eventValue: {
            href: `/${event.organization?.slug}/${event.slug}`,
          },
        })
      }
    >
      <div
        onMouseEnter={() =>
          sendTrack({
            eventName: "hover-event-card",
            eventValue: {
              href: `/${event.organization?.slug}/${event.slug}`,
            },
          })
        }
        className={clsx(
          "bg-white rounded-xl h-48 md:h-96 relative group md:outline md:outline-[5px] outline-white md:shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110",
          styles["event-card"]
        )}
      >
        <div
          className={clsx(
            "flex flex-col justify-between h-full rounded-xl relative overflow-hidden"
          )}
        >
          {finalEventCoverImage && (
            <Image
              src={finalEventCoverImage}
              alt={`${event.name}的活动封面`}
              containerClassName="absolute h-full w-full"
              className={clsx(
                "event-cover object-cover h-full w-full",
                styles["event-vertical-cover"]
              )}
              sizes={sizes}
              autoFormat
            />
          )}
          <div className="z-10 top-0 relative">
            <div
              className={clsx(
                "absolute left-0 mt-2 md:mt-4 ml-2 md:ml-4",
                "flex w-fit items-center",
                "bg-red-400 rounded-full"
              )}
            >
              {!!event.organization?.logoUrl && (
                <div className="border-2 rounded-full border-transparent">
                  <Image
                    src={event.organization.logoUrl}
                    alt={`${event.name}的展会徽标`}
                    className={clsx(
                      "rounded-full object-cover w-[28px] h-[28px] "
                    )}
                    width={100}
                    height={100}
                    sizes="100px"
                    aria-label="organization's logo"
                    autoFormat
                  />
                </div>
              )}
              <span
                aria-label="event location address"
                className={clsx(
                  "text-white rounded-full pr-2 py-1 bg-red-400 text-xs md:text-sm",
                  event.organization?.logoUrl ? "pl-1" : "pl-2"
                )}
              >
                {event.city}市
              </span>
            </div>
          </div>

          <div
            className={clsx(
              styles["event-card__desc-container"],
              "p-2 md:p-4 bg-red-100/20 group-hover:bg-red-400/90 transition duration-300 rounded-b-xl z-10 w-full",
              "text-white",
              !isDefaultCover && "backdrop-blur-md"
            )}
          >
            <h4 className=" font-bold text-base md:text-2xl">{event.name}</h4>
            <h5 className="text-sm md:text-lg">{event.organization?.name}</h5>
            <div className="text-xs md:text-base">
              {event.startDate && event.endDate && (
                <div className="flex items-center" suppressHydrationWarning>
                  <BsCalendar2DateFill className="mr-1 flex-shrink-0 text-sm" />
                  {event.startDate && event.endDate
                    ? `${format(event.startDate, "yyyy/MM/dd", {
                        locale: zhCN,
                      })} -
                ${format(event.endDate, "yyyy/MM/dd", { locale: zhCN })}`
                    : null}
                </div>
              )}
            </div>
            <div className="flex items-center text-xs md:text-base">
              <IoLocation className="mr-1 flex-shrink-0 text-sm" />
              <span aria-label="活动地址" className="truncate">
                {event.address || "尚未公布"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
