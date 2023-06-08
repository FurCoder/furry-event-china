import EventCard from "@/components/eventCard";
import { FriendSiteBlock } from "@/components/layout/footer";
import { Event, XataClient } from "@/xata/xata";
import groupBy from "lodash-es/groupBy";
import { GetServerSideProps } from "next/types";
import { useMemo } from "react";

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
  }, [props.events]);

  return (
    <>
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

        <FriendSiteBlock />
      </div>

      {/* <main className="container grid gap-12 grid-cols-3">
        {props.events.map((event) => (
          <EventCard key={event.name} event={event} />
        ))}
      </main> */}
    </>
  );
}

// export async function getStaticProps() {
//   const xata = new XataClient();
//   const events = await xata.db.event
//     .filter({
//       startDate: { $ge: new Date(new Date().getFullYear(), 0, 1) },
//       endDate: { $le: new Date(new Date().getFullYear(), 11, 31) },
//     })
//     .select(["*", "organization.*"])
//     .getAll();
//   return {
//     props: {
//       events,
//     },
//   };
// }

export const runtime = 'experimental-edge';
export const getServerSideProps: GetServerSideProps<{
  events: Event[];
}> = async (context) => {
  // console.log('context',context)
  const xata = new XataClient();
  const events = await xata.db.event
    .filter({
      startDate: { $ge: new Date(new Date().getFullYear(), 0, 1) },
      endDate: { $le: new Date(new Date().getFullYear(), 11, 31) },
    })
    .select(["*", "organization.*"])
    .getAll();
  return {
    props: {
      events,
    },
  };
};

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
              <EventCard key={event.name} event={event} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
