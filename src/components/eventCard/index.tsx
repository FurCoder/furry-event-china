import { Event } from "@/xata/xata";
import Link from "next/link";
import React, { useState } from "react";
import styles from "@/components/eventCard/index.module.css";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import Image from "@/components/image";
import clsx from "clsx";
import { sendTrack } from "@/utils/track";
import { getEventCoverUrl } from "@/utils/imageLoader";

export default function EventCard({
  event,
  sizes,
}: {
  event: Event;
  sizes?: string;
}) {
  const [isWiderImage, setIsWiderImage] = useState(true);

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
        className="bg-white rounded-xl h-96 relative group outline outline-[5px] outline-white shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110"
      >
        <div
          id="event-card-context"
          className={clsx(
            "flex flex-col justify-between h-full rounded-xl relative overflow-hidden",
            isWiderImage && styles["event-card"]
          )}
        >
          {finalEventCoverImage && (
            <Image
              onLoadingComplete={(img) => {
                img.naturalWidth < img.naturalHeight && setIsWiderImage(false);
              }}
              src={finalEventCoverImage}
              alt={`Event cover of ${event.name}`}
              className={clsx("object-cover absolute h-full w-full")}
              sizes={sizes}
            />
          )}
          <div className="z-10 relative mt-4 mx-4 flex items-center justify-between">
            <span
              aria-label="organization name"
              className="text-white rounded-full bg-red-400/70 group-hover:bg-red-400 text-sm transition duration-300 flex items-center"
            >
              {!!event.organization?.logoUrl && (
                <Image
                  src={event.organization.logoUrl}
                  alt={`The organization logo of ${event.name}`}
                  className={clsx(
                    "rounded-full object-cover w-[28px] h-[28px]"
                  )}
                  width={50}
                  height={50}
                  sizes="50px"
                />
              )}
            </span>
            <span
              aria-label="event location address"
              className="text-white rounded-full px-2 py-1 bg-red-400/70 group-hover:bg-red-400 text-sm transition duration-300"
            >
              {event.city}市
            </span>
          </div>

          <div
            className={clsx(
              styles["event-card__desc-container"],
              "p-4 bg-red-100/20 group-hover:bg-red-400/90 transition duration-300 rounded-b-xl z-10",
              !isDefaultCover && "backdrop-blur-md"
            )}
          >
            <h4 className="text-white font-bold text-2xl">{event.name}</h4>
            <h5 className="text-white text-lg">{event.organization?.name}</h5>
            <h5 className="text-white font-bold text-xl"></h5>
            <div className="text-white text-base">
              {event.startDate && event.endDate && (
                <div className="flex items-center" suppressHydrationWarning>
                  <BsCalendar2DateFill className="text-white mr-1" />
                  {event.startDate && event.endDate
                    ? `${new Date(event.startDate).toLocaleDateString()} -
                ${new Date(event.endDate).toLocaleDateString()}`
                    : null}
                </div>
              )}

              <div className="flex items-center">
                <IoLocation className="text-white mr-1" />
                <span aria-label="活动地址" className="truncate">
                  {event.address || "尚未公布"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
