import { sendTrack } from "@/utils/track";
import { Event } from "@/xata/xata";
import Link from "next/link";
import { format } from "date-fns";

function SimpleEventCard({ event }: { event: Event }) {
  return (
    <Link
      key={event.id}
      href={`/${event.organization?.slug}/${event.slug}`}
      onClick={() =>
        sendTrack({
          eventName: "click-mini-event-card",
          eventValue: {
            href: `/${event.organization?.slug}/${event.slug}`,
            from: "year list",
          },
        })
      }
      className="rounded-xl shadow relative flex justify-center items-center group bg-white"
    >
      {/* <div className="rounded-xl duration-500 transition group-hover:border-gray-400 w-full h-full absolute brightness-75 hover:brightness-100">
        <Image
          alt="活动背景"
          src={getEventCoverUrl(event)}
          width={350}
          className="h-full w-full object-cover rounded-xl overflow-hidden"
          autoFormat
        />
      </div> */}
      <div className="z-10 relative pointer-events-none p-2">
        <h4 className="tracking-wide text-slate-700 font-bold text-base text-center group-hover:text-red-400 transition">{`${event.city} · ${event.name}`}</h4>
        <p className="text-center text-slate-600">{event.organization?.name}</p>
        {event.startDate && event.endDate && (
          <p className="text-center text-slate-600 text-sm">
            {event.startDate && (
              <span>{format(event.startDate, "MM月dd日")}</span>
            )}
            -
            {event.endDate && (
              <span>{format(event.endDate, "MM月dd日")}</span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}

export default SimpleEventCard;
