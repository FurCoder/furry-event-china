import { Organization, XataClient } from "@/xata/xata";
import Link from "next/link";
import { groupBy } from "lodash-es";
import Image from "next/image";

export default function OrganizationPage({
  organizations,
}: {
  organizations: Organization[];
}) {
  const groupByStatusOrganizations = groupBy(organizations, (o) => o.status);

  return (
    <div className="bg-white p-6 rounded-xl">
      <section>
        <h1 className="font-bold text-gray-600 text-2xl">活跃展商</h1>
        <div className="mt-4 grid md:grid-cols-3 gap-10">
          {groupByStatusOrganizations["active"].map((o) => (
            <OrganizationItem key={o.id} organization={o} />
          ))}
        </div>
      </section>
    </div>
  );
}

function OrganizationItem({ organization }: { organization: Organization }) {
  return (
    <Link href={organization.slug || ""}>
      <div className="rounded-xl border p-6 cursor-pointer h-full flex flex-row items-center md:flex-col">
        <div className="relative w-2/4 md:h-3/4 max-h-12">
          <Image
            className="object-contain h-full max-h-12"
            src={organization.logoUrl || ""}
            alt={`${organization.name}'s logo`}
            width={300}
            height={50}
          />
        </div>
        <h2 className="w-2/4 tracking-wide text-gray-600 md:text-center text-lg border-l md:border-l-0 ml-4 md:ml-0 pl-4 md:pl-0 md:mt-4 font-bold">
          {organization.name}
        </h2>
      </div>
    </Link>
  );
}

export async function getStaticProps() {
  const xata = new XataClient();

  const organizations = await xata.db.organization.select(["*"]).getAll();
  return {
    props: {
      organizations,
      headMetas: {
        title: "展商列表 FEC·兽展日历",
        des: `共有 ${organizations.length} 个展商举办过 Furry 相关的活动，你最爱的展商是？`,
        link: "https://www.furryeventchina.com/organization",
      },
    },
  };
}
