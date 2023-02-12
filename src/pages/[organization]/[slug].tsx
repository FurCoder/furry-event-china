import { XataClient, Event } from "@/xata/xata";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { IoLocation } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import { TbArrowsRightLeft } from "react-icons/tb";
import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const xata = new XataClient();

export default function EventDetail({ event }: { event: Event }) {
  const [isWiderImage, setIsWiderImage] = useState(true);

  const calcImageRatio = useCallback(() => {
    if (!event.coverUrl?.length) return;
    const img = new Image();
    img.src = event.coverUrl?.[0];
    img.onload = function (this) {
      setIsWiderImage(img.width >= img.height);
    };
  }, [event.coverUrl]);

  useEffect(() => {
    // calcImageRatio();
  }, [calcImageRatio]);

  return (
    <div
      className={clsx(
        "flex border bg-white rounded-xl min-h-[500px] overflow-hidden",
        isWiderImage && "flex-col",
        !isWiderImage &&'lg:flex-row flex-col'
      )}
      // style={{
      //   backgroundImage: `url(${event.coverUrl})`,
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      // }}
    >
      <div
        className={clsx(
          "event-detail__left",
          isWiderImage && "w-full h-[400px]",
          !isWiderImage && "lg:w-7/12 w-full h-[400px] lg:h-auto"
        )}
        style={{
          backgroundImage: `url(${event.coverUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div
        className={clsx(
          "p-6 event-detail__right w-full sm1:w-5/12 flex",
          isWiderImage &&
            "w-full flex-col sm:flex-row",
          !isWiderImage && "lg:w-5/12 flex-col sm:flex-row lg:flex-col"
        )}
      >
        <div className="flex-grow">
          <h1 className="font-bold text-2xl text-gray-700">{event.name}</h1>
          <p className="flex items-center text-gray-500 mt-4">
            <IoLocation className="text-gray-500 inline-block mr-2" />
            {`${event.city} · ${event.address}`}
          </p>
          <p>{event.organization?.name}</p>
          <p className="flex items-center text-gray-500">
            <BsCalendar2DateFill className="text-gray-500 inline-block mr-2" />
            {event.startDate
              ? new Date(event.startDate).toLocaleString()
              : null}
            <TbArrowsRightLeft className="mx-2  text-sm" />
            {event.endDate ? new Date(event.endDate).toLocaleString() : null}
          </p>
        </div>

        {event.website && (
          <a
            href={event.website || "#"}
            target="_blank"
            rel="noreferrer"
            className="block mt-8 px-16 py-4 bg-red-400 hover:bg-red-300 text-white font-bold rounded-md text-center transition"
          >
            前往官网
          </a>
        )}
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

export async function getStaticProps(context: GetStaticPropsContext) {
  const event = await xata.db.event
    .filter({
      slug: context.params?.slug as string,
      "organization.slug": context.params?.organization as string,
    })
    .select(["*", "organization.slug"])
    .getFirst();
  return {
    props: {
      event,
      headMetas: {
        title: `${event?.name} FEC·兽展日历`,
        des: `${event?.address}`,
        link: `https://www.furryeventchina.com/${context.params?.organization}/${event?.slug}`,
        cover: event?.coverUrl?.[0],
      },
    },
  };
}
