import { Organization, XataClient } from "@/xata/xata";
import Image from "next/image";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FiMail } from "react-icons/fi";
import { FaBirthdayCake } from "react-icons/fa";
import { GetStaticPropsContext } from "next/types";

const xata = new XataClient();
export default function OrganizationDetail(props: {
  organization: Organization;
}) {
  const { organization } = props;
  return (
    <div className="border bg-white rounded-xl p-6">
      <div className="flex">
        <div className="border rounded flex justify-center p-2" style={{ height: 100, width: 100 }}>
          {organization.logoUrl && (
            <Image
              alt={`${organization.name}'s logo`}
              width="100"
              height="100"
              src={organization.logoUrl}
            />
          )}
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <div className="flex items-center text-gray-500 mt-2">
            <span className="flex items-center">
              <GrStatusGoodSmall className="mr-1 text-green-400" />
              {organization.status === "active" ? "活跃" : "不再活跃"}
            </span>
            <a href={`mailto:${organization.contactMail}`} className="mx-2 text-gray-500 flex items-center">
              <FiMail className="mr-1" />
              {organization.contactMail}
            </a>
            {organization.creationTime && (
              <span className="mx-2 text-gray-500 flex items-center">
                <FaBirthdayCake className="mr-1" />
                首次举办于{" "}
                {new Date(organization.creationTime).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t my-8" />

      <p className="text-slate-700">{organization.description}</p>

      {/* <div className="grid gap-4 grid-cols-3">
        <div className="col-start-2 col-end-2 text-center">
          <h1 className="text-2xl border">{organization.name}</h1>
        </div>
        <div className="">
            <p>{organization.description}</p>
        </div>
        <div><span>{organization.status}</span></div>
      </div> */}
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
  const organization = await xata.db.organization
    .filter({
      slug: context.params?.organization as string,
    })
    .select(["*"])
    .getFirst();
  return {
    props: {
      organization,
    },
  };
}
