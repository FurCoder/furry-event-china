import EventCard from "@/components/eventCard";
import { FriendSiteBlock } from "@/components/layout/footer";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import { useMemo, useState } from "react";
import { EventScale, EventStatus } from "@/types/event";
import { Switch } from "@headlessui/react";

export default function Home(props: { events: Event[] }) {
  const [selectedFilter, setFilter] = useState({
    onlyAvailable: false,
    eventScale: ["All"],
  });
  const filteredEvents = props.events.filter((event) => {
    const now = Date.now();
    const endTime = event.endDate
      ? new Date(new Date(event.endDate).setHours(23, 59, 59, 999)).getTime()
      : null;
    if (selectedFilter.onlyAvailable) {
      if (event.status === EventStatus.EventCancelled) {
        return false;
      }
      if (endTime && now > endTime) {
        return false;
      }
    }

    if (
      selectedFilter.eventScale[0] !== "All" &&
      !selectedFilter.eventScale.includes(event.scale)
    ) {
      console.log("event.scale", event.scale);
      return false;
    }
    return true;
  });
  const groupByCustomDurationEvent = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const now = Date.now();

    const durationObject: { [x in DurationType]: Event[] } = {
      now: [],
      soon: [],
      next: [],
      passed: [],
    };

    filteredEvents.forEach((event) => {
      const startTime = event.startDate
        ? new Date(new Date(event.startDate).setHours(0, 0, 0, 0)).getTime()
        : null;
      const endTime = event.endDate
        ? new Date(new Date(event.endDate).setHours(23, 59, 59, 999)).getTime()
        : null;
      const startMonth = event.startDate
        ? new Date(event.startDate).getMonth() + 1
        : null;
      const endMonth = event.endDate
        ? new Date(event.endDate).getMonth() + 1
        : null;

      if (
        startTime === null ||
        endTime === null ||
        startMonth === null ||
        endMonth === null
      ) {
        return durationObject.next.push(event);
      }
      //Passed events
      if (now > endTime) {
        return durationObject.passed.push(event);
      }

      if (startMonth <= currentMonth) {
        //Now events
        if (now > startTime && now < endTime) {
          return durationObject.now.push(event);
        } else {
          //Soon events
          return durationObject.soon.push(event);
        }
      }

      //Next events
      if (startMonth > currentMonth) {
        return durationObject.next.push(event);
      }
    });

    return durationObject;
  }, [filteredEvents]);

  return (
    <>
      <div>
        <Filter
          selectedFilter={selectedFilter}
          onChange={(filter) => setFilter(filter)}
        />
        {props.events.length === 0 && (
          <div className="bg-white border rounded-xl p-6 text-center h-96 flex justify-center flex-col">
            <h1 className="text-xl text-red-500 font-bold">
              今年还没有收集到任何展会，再等等？
            </h1>
            <p className="text-base text-gray-400 mt-2">
              或者向我们反馈一个已经官宣的展会
            </p>
          </div>
        )}
        {Object.keys(groupByCustomDurationEvent).map((type) =>
          groupByCustomDurationEvent[type as DurationType].length ? (
            <DurationSection
              key={type}
              durationType={type}
              events={groupByCustomDurationEvent[type as DurationType]}
            />
          ) : null
        )}

        <FriendSiteBlock />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();
  const events = await xata.db.event
    .filter({
      startDate: { $ge: new Date(new Date().getFullYear(), 0, 1) },
      endDate: { $le: new Date(new Date().getFullYear(), 11, 31) },
    })
    .select([
      "name",
      "address",
      "city",
      "coverUrl",
      "logoUrl",
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
    },
  };
}

enum DurationType {
  Passed = "passed", //already done.
  Now = "now", // in the duration of event.
  Soon = "soon", // in the same month of event start date.
  Next = "next", // not start yet.
}
function DurationSection({
  durationType,
  events,
}: {
  durationType: string;
  events: Event[];
}) {
  const groupByDateEvent = useMemo(() => {
    return groupBy(events, (event) =>
      // Some event open in the last day of start month, but it should be count in next month.
      event.endDate ? new Date(event.endDate).getMonth() + 1 : "unknown"
    );
  }, [events]);

  const months =
    durationType === DurationType.Passed
      ? Object.keys(groupByDateEvent).reverse()
      : Object.keys(groupByDateEvent);

  return (
    <section className="my-8 border rounded-xl p-6 bg-white">
      <h2 className="text-2xl text-red-400 font-bold mb-6">
        {durationType === DurationType.Passed && "已经结束"}
        {durationType === DurationType.Now && "就是现在"}
        {durationType === DurationType.Soon && "马上就来"}
        {durationType === DurationType.Next && "今年还有"}
      </h2>
      {months.map((month) => (
        <div key={month} className="border rounded-xl bg-gray-100 p-6 my-4">
          <h3 className="text-xl text-red-400 font-bold mb-6">
            {month}
            {month !== "unknown" ? "月" : null}{" "}
            <span className="text-sm text-gray-500 font-bold">
              共有 {groupByDateEvent[month].length} 个展会
            </span>
          </h3>
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupByDateEvent[month].map((event) => (
              <EventCard
                key={event.name}
                event={event}
                sizes="(max-width: 750px) 650px, (max-width: 1080px) 552px, 552px"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const EventScaleScaleOptions = [
  { key: "All", name: "我全都要（全部）" },
  { key: EventScale.Cosy, name: "三两小聚（小）" },
  { key: EventScale.Small, name: "有点厉害（中）" },
  { key: EventScale.Medium, name: "好多人啊（大）" },
];
function Filter({
  onChange,
  selectedFilter,
}: {
  onChange: (filter: unknown) => void;
  selectedFilter: {
    onlyAvailable: boolean;
    eventScale: (typeof EventScale)[keyof typeof EventScale][];
  };
}) {
  const handleFilter = (key: string, value: unknown) => {
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
      <Switch.Group>
        <div className="flex items-center max-sm:mb-4 max-sm:justify-between">
          <Switch.Label className="mr-4 text-gray-600">
            只看还未开始的展会
          </Switch.Label>
          <Switch
            checked={selectedFilter.onlyAvailable}
            onChange={(v) => handleFilter("onlyAvailable", v)}
            className={`${
              selectedFilter.onlyAvailable ? "bg-red-400" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">只看还未开始的展会</span>
            <span
              className={`${
                selectedFilter.onlyAvailable ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <div className="h-full bg-gray-100 w-[2px] h-4 mx-4 hidden sm:block" />

      <select
        value={selctedScaleValue[0].key}
        id="scale"
        onChange={(e) => handleFilter("eventScale", [e.target.value])}
        className="bg-white p-2 border rounded-xl text-gray-600"
      >
        {EventScaleScaleOptions.map((option) => (
          <option className="text-gray-600" key={option.key} value={option.key}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
