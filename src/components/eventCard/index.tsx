import { Event } from "@/xata/xata";
import Link from "next/link";
import React from "react";
import styles from "@/components/eventCard/index.module.css";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/${event.organization?.slug}/${event.slug}`}>
      <div className="bg-white rounded-xl h-96 relative group">
        <div
          className={`flex flex-col justify-end h-full rounded-xl ${styles["event-card"]}`}
          style={{
            backgroundImage: `url(${event.coverUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="p-6 bg-gray-400/25 group-hover:bg-gray-400/50 transition duration-300 rounded-b-xl">
            <h1 className="text-white font-bold text-2xl">
              {event.organization?.name}·{event.name}
            </h1>
            <h2 className="text-white font-bold text-xl">{event.city}市</h2>
            <div className="text-white text-base">
              {event.startDate && event.endDate
                ? `${new Date(event.startDate).toLocaleDateString()} -
                ${new Date(event.endDate).toLocaleDateString()}`
                : null}
              <span></span>
              <br />
              <span>{event.address}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
