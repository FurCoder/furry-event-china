import { Event } from "@/xata/xata";
import Link from "next/link";
import React, { useState } from "react";
import styles from "@/components/eventCard/index.module.css";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import Image from "@/components/image";
import clsx from "clsx";

export default function EventCard({
  event,
  sizes,
}: {
  event: Event;
  sizes?: string;
}) {
  const [isWiderImage, setIsWiderImage] = useState(true);

  const finalEventCoverImage =
    event.logoUrl ||
    event.coverUrl?.[0] ||
    `https://cdn.furryeventchina.com/fec-event-default-cover.png`;
  const isDefaultCover = finalEventCoverImage.includes(
    "fec-event-default-cover"
  );

  return (
    <Link href={`/${event.organization?.slug}/${event.slug}`}>
      <div className="bg-white rounded-xl h-96 relative group outline outline-[5px] outline-white shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110">
        <div
          id="event-card-context"
          className={clsx(
            "flex flex-col justify-end h-full rounded-xl relative overflow-hidden",
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
          <span className="absolute right-4 top-4 text-white rounded-full px-2 py-1 bg-red-400/70 group-hover:bg-red-400 text-sm transition duration-300">
            {event.city}市
          </span>
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
                <span aria-label="活动地址">{event.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
