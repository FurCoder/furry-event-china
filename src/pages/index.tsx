import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useMemo } from "react";
import { groupBy } from "lodash-es";
import { XataClient, Event } from "@/xata/xata";
import EventCard from "@/components/eventCard";

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
      <div>
        {props.events.length === 0 && (
          <div className="bg-white border rounded-xl p-6 text-center h-96 flex justify-center flex-col">
            <h1 className="text-xl text-red-500 font-bold">
              ???????????????????????????????????????????????????
            </h1>
            <p className="text-base text-gray-400 mt-2">
              ????????????????????????????????????????????????
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
    .select(["*", "organization.*"])
    .getMany();
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
      event.startDate ? new Date(event.startDate).getMonth() + 1 : "unknown"
    );
  }, [events]);

  return (
    <section className="my-8 border rounded-xl p-6 bg-white">
      <h2 className="text-2xl text-red-400 font-bold mb-6">
        {durationType === DurationType.Passed && "????????????"}
        {durationType === DurationType.Now && "????????????"}
        {durationType === DurationType.Soon && "????????????"}
        {durationType === DurationType.Next && "????????????"}
      </h2>
      {Object.keys(groupByDateEvent).map((month) => (
        <div key={month} className="border rounded-xl bg-gray-100 p-6 my-4">
          <h3 className="text-xl text-red-400 font-bold mb-6">
            {month}
            {month !== "unknown" ? "???" : null}{" "}
            <span className="text-sm text-gray-500 font-bold">
              ?????? {groupByDateEvent[month].length} ?????????
            </span>
          </h3>
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupByDateEvent[month].map((event) => (
              <EventCard key={event.name} event={event} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
