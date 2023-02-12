import { Organization, XataClient, Event } from "@/xata/xata";
import Image from "next/image";
import { GrStatusGoodSmall } from "react-icons/gr";
import { HiOutlineMail } from "react-icons/hi";
import { FaBirthdayCake } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import styles from "@/styles/Organization.module.css";
import clsx from "clsx";
import EventCard from "@/components/eventCard";

const xata = new XataClient();
export default function OrganizationDetail(props: {
  events: Event[];
  organization: Organization;
}) {
  const { organization, events } = props;

  const formatedCreationTime = useMemo(() => {
    if (organization.creationTime) {
      const date = new Date(organization.creationTime);
      console.log(organization.creationTime);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    } else {
      return null;
    }
  }, [organization.creationTime]);

  return (
    <div>
      <div className="border bg-white rounded-xl p-6">
        <div className="flex">
          <div
            className="border rounded flex justify-center p-2"
            style={{ height: 200, width: 200 }}
          >
            {organization.logoUrl && (
              <Image
                className="object-contain"
                alt={`${organization.name}'s logo`}
                width={200}
                height={200}
                src={organization.logoUrl}
              />
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold mb-2">{organization.name}</h1>

            <div className="flex items-center text-gray-500 mb-2">
              <span className="flex items-center">
                <GrStatusGoodSmall className="mr-1 text-green-400" />
                {organization.status === "active" ? "活跃" : "不再活跃"}
              </span>
            </div>

            <div className={clsx("mb-2 text-gray-500", styles["intro-bar"])}>
              <span>已累计举办 {events.length} 场展会</span>
              {formatedCreationTime && (
                <span className="lex items-center">
                  {`首次举办于 ${formatedCreationTime?.year}年${formatedCreationTime?.month}月${formatedCreationTime?.day}日`}
                </span>
              )}
            </div>

            {/* <div className="flex items-center text-gray-500 mt-2">
            <a
              href={`mailto:${organization.contactMail}`}
              className="mr-2 text-gray-500 flex items-center inline-block"
            >
              <HiOutlineMail className="mr-1 text-xl" />
              <span className="uppercase">{organization.contactMail}</span>
            </a>
          </div> */}

            <div
              className={clsx(
                "flex items-center flex-wrap first:mr-0",
                styles.links
              )}
            >
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-300 rounded-xl px-4 py-1 text-white"
                >
                  去官网
                </a>
              )}
              {/* <button className="bg-blue-300 rounded-xl px-4 py-1 text-white">
              去微博
            </button>
            <button className="bg-blue-300 rounded-xl px-4 py-1 text-white">
              去微信公众号
            </button>
            <button className="bg-blue-300 rounded-xl px-4 py-1 text-white">
              去QQ群
            </button> */}
              {organization.contactMail && (
                <div className="flex items-center bg-green-600 rounded-xl px-4 py-1 text-white">
                  <a className="" href={`mailto:${organization.contactMail}`}>
                    {/* <button className=""> */}
                    发邮件给 {organization.contactMail}
                    {/* </button> */}
                  </a>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(organization.contactMail!);
                    }}
                    className="border-l pl-2 cursor-pointer"
                  >
                    <MdOutlineContentCopy />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t my-8" />

        <p className="text-slate-700">{organization.description}</p>
      </div>

      {events.length && (
        <section className="mt-8 grid gird-cols-1 gap-8">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </section>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const organizations = await xata.db.organization.select(["*"]).getMany();
  return {
    paths: organizations.map((organization) => ({
      params: { organization: organization.slug },
    })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const organizationPromise = xata.db.organization
    .filter({
      slug: context.params?.organization as string,
    })
    .select(["*"])
    .getFirst();

  const eventPromise = xata.db.event
    .filter({
      "organization.slug": context.params?.organization as string,
    })
    .select(["*", "organization.name", "organization.slug"])
    .sort("startDate", "desc")
    .getAll();

  const [organization, events] = await Promise.all([
    organizationPromise,
    eventPromise,
  ]);

  return {
    props: {
      organization,
      events,
      headMetas: {
        title: `${organization?.name} FEC·兽展日历`,
        des: `${organization?.description}`,
        link: `https://www.furryeventchina.com/${organization?.slug}`,
        cover: organization?.logoUrl,
      },
    },
  };
}
