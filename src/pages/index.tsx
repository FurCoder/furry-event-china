import EventCard from "@/components/eventCard";
import { FriendSiteBlock } from "@/components/layout/footer";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import { useMemo, useState } from "react";
import { EventScale, EventStatus } from "@/types/event";
import { Switch } from "@headlessui/react";
import NextImage from "@/components/image";
import { sendTrack } from "@/utils/track";
import { DurationType } from "@/types/list";
import { filteringEvents, groupByCustomDurationEvent } from "@/utils/event";
import { IoIosArrowDown } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import clsx from "clsx";
import { compareAsc } from "date-fns";

export default function Home(props: { events: Event[] }) {
  const [selectedFilter, setFilter] = useState({
    onlyAvailable: false,
    eventScale: ["All"],
  });

  const filteredEvents = filteringEvents(props.events, selectedFilter);
  const groupByCustomDurationEvents =
    groupByCustomDurationEvent(filteredEvents);

  return (
    <>
      <div>
        <Slider />

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
    <section className="my-8 border rounded-xl p-6 bg-white">
      <h2 className="text-2xl text-red-400 font-bold mb-6">
        {durationType === DurationType.Passed && "已经结束"}
        {durationType === DurationType.Now && "就是现在"}
        {durationType === DurationType.Soon && "马上就来"}
        {durationType === DurationType.Next && "今年还有"}
        {durationType === DurationType.NextYear && "看看来年"}
      </h2>
      {months.map((month) => (
        <div key={month} className="border rounded-xl bg-gray-100 p-6 my-4">
          <h3 className="text-xl text-red-400 font-bold mb-6">
            {month !== "unknown"
              ? durationType === DurationType.NextYear
                ? `明年${month}月 `
                : `${month}月 `
              : null}
            <span className="text-sm text-gray-500 font-bold">
              共有 {groupByDateEvent[month].length} 个展会
            </span>
          </h3>
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupByDateEvent[month]
              .sort((a, b) =>
                a.startDate && b.startDate
                  ? compareAsc(a?.startDate, b.startDate)
                  : 0
              )
              .map((event) => (
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
  onChange: (filter: {
    onlyAvailable: boolean;
    eventScale: (typeof EventScale)[keyof typeof EventScale][];
  }) => void;
  selectedFilter: {
    onlyAvailable: boolean;
    eventScale: (typeof EventScale)[keyof typeof EventScale][];
  };
}) {
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

      <div className="bg-gray-100 w-[2px] h-4 mx-4 hidden sm:block" />

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

function Slider() {
  const [expand, setExpand] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden mb-6 relative">
      <a
        className="relative block"
        target="_blank"
        href="https://www.wilddream.net/contest/2024contest?utm_source=fec"
        onClick={() => {
          sendTrack({
            eventName: "click-slider-link",
            eventValue: {
              href: "https://www.wilddream.net/contest/2024contest?utm_source=fec",
            },
          });
        }}
      >
        <NextImage
          priority
          src="https://www.wilddream.net/Public/images/contest/2024/banner_20231206.jpg"
          className="object-cover w-full h-full"
          alt="WildDream创作站兽主题绘画比赛·2024"
        />
      </a>

      <div className="p-6">
        <h6
          className="hover:cursor-pointer w-fit text-gray-600 font-bold text-base md:text-xl flex items-center"
          onClick={() => {
            setExpand(!expand);
            sendTrack({
              eventName: "click-slider-detail",
              eventValue: {
                item: "wilddream",
              },
            });
          }}
        >
          WildDream 创作站兽主题绘画比赛·2024
          <span className={clsx(!expand && "animate-bounce")}>
            <IoIosArrowDown
              className={clsx(
                "transition-all dutation-300 hover:cursor-pointer ml-2",
                {
                  "rotate-180": expand,
                  "rotate-0": !expand,
                }
              )}
            />
          </span>
        </h6>
        <div
          className={clsx(
            "transition-[max-height] duration-300 overflow-hidden",
            {
              "max-h-96": expand,
              "max-h-0 ": !expand,
            }
          )}
        >
          <div className="mb-2 flex flex-col md:flex-row md:items-center">
            <span className="text-sm text-gray-500">
              活动时间：2024年1月19日 - 2024年3月15日（北京时间 23:59）
            </span>
            <hr className="hidden md:block mr-2 h-4 border-r-[1px] border-gray-300" />
            <a
              className="text-red-400 text-sm underline underline-offset-4 inline-flex items-center"
              target="_blank"
              href="https://www.wilddream.net/contest/2024contest?utm_source=fec"
              onClick={() => {
                sendTrack({
                  eventName: "click-slider-link",
                  eventValue: {
                    href: "https://www.wilddream.net/contest/2024contest?utm_source=fec",
                  },
                });
              }}
            >
              前往活动页
              <FaLink />
            </a>
          </div>

          <p className="text-sm md:text-base text-gray-500">
            “WildDream创作站兽主题绘画比赛·2024”是由WildDream创作站主办的，以兽、兽人、动物、奇幻生物为主题的公益绘画比赛。
            <br />
            本比赛每届设定一个比赛主题，邀请在兽主题创作领域具有丰富经验的绘师担任评委，并辅以公众投票环节，希望能够发掘优秀的兽主题创作者，并为创作者们带来更多关注和支持。同时我们相信，地球上现有的野性生灵们始终是兽主题创作的源头活水。本比赛为濒危动物主题创作设立奖项，并将比赛周边收入捐赠给动物保育组织，希望为它们的生存和发展带来更多关注和支持。
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();
  const events = await xata.db.event
    .filter({
      endDate: { $ge: new Date(new Date().getUTCFullYear(), 0, 1) },
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
    },
  };
}
