import EventCard from "@/components/eventCard";
import { Event, XataClient } from "@/xata/xata";
import { groupBy } from "lodash-es";
import { useMemo } from "react";

export default function Years({ events }: { events: Event[] }) {
  const groupByYearEvents = useMemo(
    () =>
      groupBy(events, (e) =>
        e.startDate ? new Date(e.startDate).getFullYear() : "no-date"
      ),
    [events]
  );

  return (
    <div className="">
      {Object.keys(groupByYearEvents)
        .sort((a, b) => {
          if (a !== "no-date" && b !== "no-date") {
            return Number(b) - Number(a);
          }
          if (a === "no-date") {
            return -1;
          }
          if (b === "no-date") {
            return 1;
          }
          return 0;
        })
        .map((yearLabel) => (
          <section
            key={yearLabel}
            className="mb-4 border rounded-xl p-6 bg-white"
          >
            <h1 className="font-bold text-gray-400 text-3xl mb-4">
              {yearLabel === "no-date" ? "暂未定档" : yearLabel}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {groupByYearEvents[yearLabel].map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();

  const events = await xata.db.event
    .select(["*", "organization.name", "organization.slug"])
    .getAll();
  const cities = Object.keys(groupBy(events, (event) => event.city));
  return {
    props: {
      events,
      headMetas: {
        title: "年度时间轴 FEC·兽展日历",
        des: `共有 ${cities} 个城市举办过 ${events.length} 场 Furry 相关的展会活动，你去过多少？`,
        link: "https://www.furryeventchina.com/years",
      },
    },
  };
}
