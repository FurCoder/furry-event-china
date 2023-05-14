import { Event } from "@/xata/xata";
import Link from "next/link";
import React from "react";
import styles from "@/components/eventCard/index.module.css";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/${event.organization?.slug}/${event.slug}`}>
      <div className="bg-white rounded-xl h-96 relative group">
        <div
          id="event-card-context"
          className={`flex flex-col justify-end h-full rounded-xl ${styles["event-card"]}`}
          style={{
            backgroundImage: `url(${event.logoUrl || event.coverUrl?.[0]})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <span className="absolute right-4 top-4 text-white rounded-full px-2 bg-red-400 text-sm">
            {event.city}市
          </span>
          <div className=" p-4 bg-gray-400/70 group-hover:bg-red-400/90 transition duration-300 rounded-b-xl">
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
