import EventCard from "@/components/eventCard";
import { FriendSiteBlock } from "@/components/layout/footer";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import { useMemo, useState } from "react";
import { EventScale, EventStatus } from "@/types/event";
import { Label, Switch, SwitchGroup } from "@headlessui/react";
import { sendTrack } from "@/utils/track";
import { DurationType } from "@/types/list";
import {
  filteringEvents,
  groupByCustomDurationEvent,
  sortEvents,
} from "@/utils/event";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home(props: { events: Event[] }) {
  const [selectedFilter, setFilter] = useState({
    onlyAvailable: false,
    eventScale: ["all"],
  });

  const filteredEvents = filteringEvents(props.events, selectedFilter);
  const groupByCustomDurationEvents =
    groupByCustomDurationEvent(filteredEvents);

  return (
    <>
      <div>
        <Filter
          selectedFilter={selectedFilter}
          onChange={(filter) => setFilter(filter)}
        />

        {filteredEvents.length === 0 && (
          <div className="bg-white border rounded-xl p-6 mt-6 text-center h-96 flex justify-center flex-col">
            <h1 className="text-xl text-red-400 font-bold">
              似乎没有满足查询需求的展会...<br></br>
              换个查询条件，或者...再等等？
            </h1>
            <p className="text-base text-gray-400 mt-2">
              你也可以向我们反馈一个已经官宣的展会！页脚有我们的联系方式！
            </p>
          </div>
        )}

        {Object.keys(groupByCustomDurationEvents).map((type) =>
          groupByCustomDurationEvents[type as DurationType].length ? (
            <DurationSection
              key={type}
              durationType={type}
              events={groupByCustomDurationEvents[type as DurationType]}
            />
          ) : null
        )}

        <FriendSiteBlock />
      </div>
    </>
  );
}

function DurationSection({
  durationType,
  events,
}: {
  durationType: string;
  events: Event[];
}) {
  const { t } = useTranslation();
  const groupByDateEvent = useMemo(() => {
    return groupBy(events, (event) =>
      // Some event open in the last day of start month, but it should be count in next month.
      event.endDate ? new Date(event.endDate).getUTCMonth() + 1 : "unknown"
    );
  }, [events]);

  const months =
    durationType === DurationType.Passed
      ? Object.keys(groupByDateEvent).reverse()
      : Object.keys(groupByDateEvent);

  return (
    <section className="my-8 border rounded-xl p-3 md:p-6 bg-white">
      <h2 className="text-xl md:text-2xl text-red-400 font-bold md:mb-6">
        {durationType === DurationType.Passed &&
          t("homepage.group.status.passed")}
        {durationType === DurationType.Now && t("homepage.group.status.now")}
        {durationType === DurationType.Soon && t("homepage.group.status.soon")}
        {durationType === DurationType.Next && t("homepage.group.status.next")}
        {durationType === DurationType.NextYear &&
          t("homepage.group.status.nextYear")}
      </h2>
      {months.map((month) => (
        <div
          key={month}
          className="border rounded-xl bg-gray-100 p-2 md:p-6 my-4"
        >
          <h3 className="text-lg md:text-xl text-red-400 font-bold mb-2 md:mb-6">
            {month !== "unknown"
              ? durationType === DurationType.NextYear
                ? t('homepage.nextYearMonth',{month})
                : t('homepage.month',{month})
              : null}
            <span className="text-sm text-gray-500 font-bold ml-1">
              {t("homepage.total", { total: groupByDateEvent[month].length })}
            </span>
          </h3>
          <div className="grid gap-4 md:gap-10 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortEvents(groupByDateEvent[month], "asc").map((event) => (
              <EventCard
                key={event.name}
                event={event}
                sizes="(max-width: 750px) 650px, (max-width: 1080px) 552px, 552px"
                fallbackWidth={650}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const EventScaleScaleOptions = [
  { key: "all", name: "我全都要（全部）" },
  { key: EventScale.Cosy, name: "三两小聚（小型展）" },
  { key: EventScale.Small, name: "有点厉害（中型展）" },
  { key: EventScale.Medium, name: "好多人啊（大型展）" },
];
function Filter({
  onChange,
  selectedFilter,
}: {
  onChange: (filter: {
    onlyAvailable: boolean;
    eventScale: (typeof EventScale)[keyof typeof EventScale][];
  }) => void;
  selectedFilter: {
    onlyAvailable: boolean;
    eventScale: (typeof EventScale)[keyof typeof EventScale][];
  };
}) {
  const { t } = useTranslation();
  const handleFilter = (key: string, value: unknown) => {
    sendTrack({
      eventName: "click-filter",
      eventValue: {
        filterName: key,
        filterValue: value,
      },
    });
    onChange({
      ...selectedFilter,
      [key]: value,
    });
  };

  const selctedScaleValue = EventScaleScaleOptions.filter((e) =>
    selectedFilter.eventScale.includes(e.key)
  );
  return (
    <div className="bg-white border rounded-xl p-6 flex sm:items-center flex-col sm:flex-row relative">
      <SwitchGroup>
        <div className="flex items-center max-sm:mb-4 max-sm:justify-between">
          <Label className="mr-4 text-gray-600">
            {t("event.filter.onlyAvailable")}
          </Label>
          <Switch
            checked={selectedFilter.onlyAvailable}
            onChange={(v) => handleFilter("onlyAvailable", v)}
            className={`${
              selectedFilter.onlyAvailable ? "bg-red-400" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">{t("event.filter.onlyAvailable")}</span>
            <span
              className={`${
                selectedFilter.onlyAvailable ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </SwitchGroup>

      <div className="bg-gray-100 w-[2px] h-4 mx-4 hidden sm:block" />

      <select
        value={selctedScaleValue[0].key}
        id="scale"
        onChange={(e) => handleFilter("eventScale", [e.target.value])}
        className="bg-white p-2 border rounded-xl text-gray-600"
      >
        {EventScaleScaleOptions.map((option) => (
          <option className="text-gray-600" key={option.key} value={option.key}>
            {t(`event.filter.${option.key}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const xata = new XataClient();
  const events = await xata.db.event
    .filter({
      $any: [
        { endDate: { $ge: new Date(new Date().getUTCFullYear(), 0, 1) } },
        { $notExists: "endDate" },
      ],
      $not: {
        status: EventStatus.EventCancelled,
      },
    })
    .select([
      "name",
      "address",
      "city",
      "coverUrl",
      "posterUrl",
      "startDate",
      "endDate",
      "slug",
      "status",
      "scale",
      "organization.name",
      "organization.logoUrl",
      "organization.slug",
    ])
    .getAll();
  return {
    props: {
      events,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 86400,
  };
}
