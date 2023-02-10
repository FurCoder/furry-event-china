import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useMemo } from "react";
import { groupBy } from "lodash-es";
import { XataClient, Event } from "@/xata/xata";

export default function Home(props: { events: Event[] }) {
  const groupByCustomDurationEvent = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const now = Date.now();

    const durationObject: { [x in DurationType]: Event[] } = {
      now: [],
      soon: [],
      next: [],
      passed: [],
    };

    props.events.forEach((event) => {
      const startTime = event.startDate
        ? new Date(event.startDate).getTime()
        : null;
      const endTime = event.endDate ? new Date(event.endDate).getTime() : null;
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

      if (startMonth === currentMonth) {
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
  }, [props.events]);

  return (
    <>
      <Head>
        <title>FEC·2023</title>
      </Head>

      <div>
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
      </div>

      {/* <main className="container grid gap-12 grid-cols-3">
        {props.events.map((event) => (
          <EventCard key={event.name} event={event} />
        ))}
      </main> */}
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
    .select(["*", "organization.slug"])
    .getMany();
  return {
    props: {
      events,
    },
  };
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/${event.organization?.slug}/${event.slug}`}>
      <div
        className="bg-white rounded-xl h-96 flex flex-col justify-end"
        style={{
          backgroundImage: `url(${event.coverUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="p-6 bg-gray-400/25 rounded-b-xl">
          <h1 className="text-white font-bold text-2xl">{event.city}市</h1>
          <h2 className="text-white font-bold text-xl">{event.name}</h2>
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
    </Link>
  );
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
      event.startDate ? new Date(event.startDate).getMonth() + 1 : "unknown"
    );
  }, [events]);

  return (
    <section className="my-8 border rounded-xl p-6 bg-white">
      <h2 className="text-2xl text-red-400 font-bold mb-6">
        {durationType === DurationType.Passed && "已经结束"}
        {durationType === DurationType.Now && "就是现在"}
        {durationType === DurationType.Soon && "马上就来"}
        {durationType === DurationType.Next && "今年还有"}
      </h2>
      {Object.keys(groupByDateEvent).map((month) => (
        <div key={month} className="border rounded-xl bg-gray-100 p-6 my-4">
          <h3 className="text-xl text-red-400 font-bold mb-6">
            {month}
            {month !== "unknown" ? "月" : null}{" "}
            <span className="text-sm text-gray-500 font-bold">
              共有 {groupByDateEvent[month].length} 个展会
            </span>
          </h3>
          <div className="grid gap-12 grid-cols-4">
            {groupByDateEvent[month].map((event) => (
              <EventCard key={event.name} event={event} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
