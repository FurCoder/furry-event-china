import { sortByStartDateDesc } from "@/utils/event";
import { sendTrack } from "@/utils/track";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import Link from "next/link";
import { useMemo } from "react";
import { getEventCoverUrl } from "@/utils/imageLoader";

export default function City(props: { events: Event[] }) {
  const { events } = props;

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

  const groupByCityEventsSortByTotalCount = useMemo(() => {
    return cities.sort((prev, current) => {
      return groupByCityEvents[prev].length -
        groupByCityEvents[current].length >
        0
        ? -1
        : 1;
    });
  }, [cities, groupByCityEvents]);

  return (
    <>
      <div className="bg-white border p-6 rounded-xl">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <li key={city} className="group">
              <a
                href={`#${city}`}
                onClick={() =>
                  sendTrack({
                    eventName: "click-city-jump-link",
                    eventValue: {
                      value: city,
                      from: "city list",
                    },
                  })
                }
              >
                <h2 className="text-lg font-bold text-gray-600 group-hover:text-red-400 transition duration-300">
                  {city}市
                  <span className="text-sm font-normal ml-1">
                    {groupByCityEvents[city].length}个
                  </span>
                </h2>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-gray-600 mt-4">
          FurrrEventChina.com 共在 {cities.length} 个城市收录到 {events.length}{" "}
          个活动，其中，举办活动次数最多的城市是{" "}
          <span className="font-bold">
            {groupByCityEventsSortByTotalCount[0]}市
          </span>
          ！紧随其后的是
          <span className="font-bold">
            {groupByCityEventsSortByTotalCount[1]}市
          </span>
          ，而举办活动次数排名第三的城市是{" "}
          <span className="font-bold">
            {groupByCityEventsSortByTotalCount[2]}市 🎉。
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 bg-white border p-6 rounded-xl mt-6">
        {groupByCityAndYearEvents.map((city) => (
          <div id={city.location} key={city.location}>
            <h2 className="text-2xl font-bold text-gray-600">
              {city.location}市
            </h2>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {city.eventsGroup.map((yearGroup) => (
                <div key={`${city}${yearGroup.year}`}>
                  <h3 className="text-gray-500">
                    {yearGroup.year === "no-date" ? "暂未定档" : yearGroup.year}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {yearGroup.events.map((event) => (
                      <Link
                        key={event.id}
                        href={`/${event.organization?.slug}/${event.slug}`}
                        onClick={() =>
                          sendTrack({
                            eventName: "click-mini-event-card",
                            eventValue: {
                              href: `/${event.organization?.slug}/${event.slug}`,
                              from: "city list",
                            },
                          })
                        }
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
                            backgroundImage: `url(${getEventCoverUrl(event)})`,
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
    </>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();

  const events = await xata.db.event
    .select([
      "name",
      "city",
      "slug",
      "posterUrl",
      "coverUrl",
      "startDate",
      "organization.slug",
      "organization.name",
    ])
    .getAll();

  const cities = Object.keys(groupBy(events, (event) => event.city));
  return {
    props: {
      events,
      headMetas: {
        title: "兽展城市列表 FEC·兽展日历",
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历共收录来自中国大陆共 ${cities} 个城市举办过的 ${events.length} 场 Furry 相关的展会活动信息！快来看看这些城市有没有你所在的地方吧！`,
        link: "https://www.furryeventchina.com/city",
      },
      structuredData: {
        breadcrumb: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "城市",
              item: "https://www.furryeventchina.com/city/",
            },
          ],
        },
      },
    },
  };
}
