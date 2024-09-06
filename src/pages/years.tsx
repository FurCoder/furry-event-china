import groupBy from "lodash-es/groupBy";
import { eventGroupByMonth, eventGroupByYear } from "@/utils/event";
import SimpleEventCard from "@/components/SimpleEventCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import wfetch from "@/api";
import { z } from "zod";
import { EventType } from "@/types/event";

export default function Years({ events }: { events: EventType[] }) {
  const groupByYearEvents = eventGroupByYear(events, "asc");

  const { t } = useTranslation();

  const years = groupByYearEvents.map((group) => group.year);

  return (
    <div>
      <div className="mb-4 border rounded-xl p-6 bg-white">
        <h2 className="font-bold text-red-400 text-2xl mb-4">总结</h2>
        <p className="text-gray-600">
          {t("years.des", {
            totalYear: years.filter((year) => year !== "no-date").length,
            totalAmount: events.length,
          })}
          <br />
          {groupByYearEvents.map((group, groupIndex) => (
            <span key={group.year}>
              {t("years.eachYear", {
                year: group.year,
                amount: group.events.length,
              })}
              {groupIndex === groupByYearEvents.length - 1 ? "。" : "，"}
            </span>
          ))}
        </p>
      </div>

      {groupByYearEvents.map((yearGroup) => (
        <section
          key={yearGroup.year}
          className="mb-4 border rounded-xl p-6 bg-white"
        >
          <h2 className="font-bold text-red-400 text-2xl mb-4">
            {yearGroup.year === "no-date"
              ? t("years.unknown")
              : t("years.known", { year: yearGroup.year })}
          </h2>
          <p className="text-gray-600 mb-4">
            {yearGroup.year === "no-date" ? "" : t("years.thisYear")}
            {t("years.total", { total: yearGroup.events.length })}：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {eventGroupByMonth(yearGroup.events, "asc").map((monthGroup) => (
              <div
                key={monthGroup.month + yearGroup.year}
                className="border rounded-xl bg-gray-100 p-2"
              >
                <h3 className="text-red-400 text-xl font-bold mb-2">
                  {t("years.month", { month: monthGroup.month })}
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

export async function getStaticProps({ locale }: { locale: string }) {
  const events = await wfetch.get("/event/all").json();

  const parseEventResult = z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
        addressExtra: z.object({ city: z.string().nullable() }).nullable(),
        startAt: z.string().datetime().nullable(),
        endAt: z.string().datetime().nullable(),
        organization: z.object({
          name: z.string(),
          slug: z.string(),
        }),
      })
    )
    .safeParse(events);

  const validEvents = parseEventResult.data?.map(
    ({ startAt, endAt, addressExtra, ...rest }) => ({
      ...rest,
      startDate: startAt,
      endDate: endAt,
      city: addressExtra?.city,
    })
  );
  return {
    props: {
      events: validEvents,
      headMetas: {
        title: "年度时间轴",
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历在过去的 7年里共计收录了 ${validEvents?.length} 场 Furry 相关的展会活动，你去过多少场呢？愿你能在这里找到最美好的回忆！`,
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
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 86400,
  };
}
