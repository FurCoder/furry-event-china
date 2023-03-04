import { XataClient } from "@/xata/xata";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import { Event } from "@/xata/xata";
import { groupBy } from "lodash-es";
import Link from "next/link";
import Image from "next/image";
import { sortByStartDateDesc } from "@/utils/event";

export default function City(props: { events: Event[] }) {
  const { events } = props;

  [{ location: "shanghai", eventsGroup: [{ year: "2023", events: [] }] }];

  const groupByCityEvents = useMemo(() => {
    return groupBy(events, (event) => event.city);
  }, [events]);

  const cities = useMemo(() => {
    return Object.keys(groupByCityEvents);
  }, [groupByCityEvents]);

  const groupByCityAndYearEvents = useMemo(() => {
    const output = cities.map((c) => ({
      location: c,
      eventsGroup: sortByStartDateDesc(groupByCityEvents[c]),
    }));
    return output;
  }, [cities, groupByCityEvents]);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 bg-white border p-6 rounded-xl">
        {groupByCityAndYearEvents.map((city) => (
          <div key={city.location}>
            <h1 className="text-2xl font-bold text-gray-600">
              {city.location}市
            </h1>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {city.eventsGroup.map((yearGroup) => (
                <div key={`${city}${yearGroup.year}`}>
                  <h2 className="text-gray-500">
                    {yearGroup.year === "no-date" ? "暂未定档" : yearGroup.year}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {yearGroup.events.map((event) => (
                      <Link
                        key={event.id}
                        href={`/${event.organization?.slug}/${event.slug}`}
                        className="rounded-xl shadow-xl h-36 relative flex justify-center items-center group"
                      >
                        {/* <div className="w-full h-36 overflow-hidden rounded-t-xl p-4">
                          {event.coverUrl?.[0] && (
                            <Image
                              alt="event cover"
                              src={event.coverUrl?.[0]}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover rounded-xl overflow-hidden"
                            />
                          )}
                        </div> */}
                        <div
                          className="rounded-xl duration-500 transition group-hover:border-gray-400 w-full h-full absolute brightness-75 hover:brightness-100"
                          style={{
                            backgroundImage: `url(${event.coverUrl})`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            // filter: "brightness(0.9)",
                          }}
                        ></div>
                        <div className="z-10 relative pointer-events-none">
                          <span className="tracking-wide text-white font-bold text-lg text-center inline-block w-full">{`${event.organization?.name} · ${event.name}`}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl text-center font-bold text-gray-600 text-xl">
        🐦 鸽子在码头施工中,这里应该有一个地图
      </div>
    </>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();

  const events = await xata.db.event
    .select(["*", "organization.slug", "organization.name"])
    .getAll();

  const cities = Object.keys(groupBy(events, (event) => event.city));
  return {
    props: {
      events,
      headMetas: {
        title: "城市列表 FEC·兽展日历",
        des: `共有 ${cities} 个城市举办过 ${events.length} 场 Furry 相关的展会活动！快来看看这些城市有没有你所在的地方吧。`,
        link: "https://www.furryeventchina.com/city",
      },
    },
  };
}
