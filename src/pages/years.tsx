import EventCard from "@/components/eventCard";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import { eventGroupByMonth, eventGroupByYear } from "@/utils/event";
import SimpleEventCard from "@/components/SimpleEventCard";

export default function Years({ events }: { events: Event[] }) {
  const groupByYearEvents = eventGroupByYear(events, "asc");

  const years = groupByYearEvents.map((group) => group.year);

  return (
    <div className="">
      <div className="mb-4 border rounded-xl p-6 bg-white">
        <h2 className="font-bold text-red-400 text-2xl mb-4">总结</h2>
        <p className="text-gray-600">
          FEC·兽展日历共在 {years.filter((year) => year !== "no-date").length}{" "}
          年里收录到 {events.length} 个兽展/兽聚。 其中：
          <br />
          {groupByYearEvents.map((group, groupIndex) => (
            <span key={group.year}>{`${group.year}年共有 ${
              group.events.length
            } 个兽展${
              groupIndex === groupByYearEvents.length - 1 ? "。" : "，"
            }`}</span>
          ))}
        </p>
      </div>

      {groupByYearEvents.map((yearGroup) => (
        <section
          key={yearGroup.year}
          className="mb-4 border rounded-xl p-6 bg-white"
        >
          <h2 className="font-bold text-red-400 text-2xl mb-4">
            {yearGroup.year === "no-date" ? "暂未定档" : yearGroup.year}
          </h2>
          <p className="text-gray-600 mb-4">
            {yearGroup.year === "no-date" ? "" : `这一年`}共有{" "}
            {yearGroup.events.length} 场兽展/兽聚：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {eventGroupByMonth(yearGroup.events, "asc").map((monthGroup) => (
              // <EventCard
              //   key={event.id}
              //   event={event}
              //   sizes="(max-width: 750px) 650px, (max-width: 1080px) 552px, 552px"
              // />
              <div
                key={monthGroup.month + yearGroup.year}
                className="border rounded-xl bg-gray-100 p-2"
              >
                <h3 className="text-red-400 text-xl font-bold mb-2">
                  {monthGroup.month}月
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {monthGroup.events.map((event) => (
                    <SimpleEventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
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
    .select([
      "name",
      // "address",
      "city",
      // "coverUrl",
      // "posterUrl",
      "startDate",
      "endDate",
      "slug",
      "organization.name",
      "organization.slug",
    ])
    .getAll();
  const cities = Object.keys(groupBy(events, (event) => event.city));
  return {
    props: {
      events,
      headMetas: {
        title: "年度时间轴",
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历共收录来自中国大陆的 ${cities} 个城市举办过的 ${events.length} 场 Furry 相关的展会活动，你去过多少场呢？愿你能在这里找到最美好的回忆！`,
        link: "https://www.furryeventchina.com/years",
      },
      structuredData: {
        breadcrumb: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "年度时间轴",
              item: "https://www.furryeventchina.com/years",
            },
          ],
        },
      },
    },
    revalidate: 86400,
  };
}
