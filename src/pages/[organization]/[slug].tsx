import { XataClient, Event } from "@/xata/xata";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { GrMapLocation } from "react-icons/gr";
import { BsCalendarDate } from "react-icons/bs";

const xata = new XataClient();

export default function EventDetail({ event }: { event: Event }) {
  console.log(event);
  return (
    <div className="flex border bg-white rounded-xl min-h-[500px] overflow-hidden">
      <div
        className="event-detail__left w-2/4"
        style={{
          backgroundImage: `url(${event.coverUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="p-6 event-detail__right w-2/4 flex flex-col">
        <div className="flex-grow">
          <h1 className="font-bold text-2xl text-gray-700">{event.name}</h1>
          <p className="flex items-center text-gray-500">
            <GrMapLocation className="text-gray-500 inline-block mr-2" />
            {event.address}
          </p>
          <p>{event.organization?.name}</p>
          <p>{event.website}</p>
          <p className="flex items-center text-gray-500">
            <BsCalendarDate className="text-red-500 inline-block mr-2" />
            {event.startDate
              ? new Date(event.startDate).toLocaleString()
              : null}{" "}
            - {event.endDate ? new Date(event.endDate).toLocaleString() : null}
          </p>
        </div>

        <a
          href={event.website || "#"}
          className="block mt-8 px-16 py-4 bg-red-400 text-white font-bold rounded-md text-center"
        >
          前往官网
        </a>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const events = await xata.db.event
    .select(["*", "organization.slug"])
    .getMany();
  return {
    paths: events.map((event) => ({
      params: { organization: event.organization?.slug, slug: event.slug },
    })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context) {
  // const router = useRouter();
  // const { organization, eventSlug } = router.query;
  // console.log(organization, eventSlug);
  console.log("params", context.params);
  const event = await xata.db.event
    .filter({
      slug: context.params.slug,
      "organization.slug": context.params.organization,
    })
    .select(["*", "organization.slug"])
    .getFirst();
  return {
    props: {
      event,
    },
  };
}
