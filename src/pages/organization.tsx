import { Organization, XataClient } from "@/xata/xata";
import clsx from "clsx";
import groupBy from "lodash-es/groupBy";
import Image from "@/components/image";
import Link from "next/link";
import { sendTrack } from "@/utils/track";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import wfetch from "@/api";
import { z } from "zod";

export default function OrganizationPage({
  organizations,
}: {
  organizations: Organization[];
}) {
  const groupByStatusOrganizations = groupBy(organizations, (o) => o.status);
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl">
      <section>
        <h1 className="font-bold text-gray-600 text-2xl">
          {t("organization.active")}
        </h1>
        <div className="mt-4 grid md:grid-cols-3 gap-10">
          {groupByStatusOrganizations["active"].map((o) => (
            <OrganizationItem key={o.id} organization={o} />
          ))}
        </div>
      </section>
      <section className="mt-6">
        <h1 className="font-bold text-gray-600 text-2xl">
          {t("organization.inactive")}
        </h1>
        <div className="mt-4 grid md:grid-cols-3 gap-10">
          {groupByStatusOrganizations["inactive"].map((o) => (
            <OrganizationItem key={o.id} organization={o} />
          ))}
        </div>
      </section>
    </div>
  );
}

function OrganizationItem({ organization }: { organization: Organization }) {
  return (
    <Link
      href={organization.slug || ""}
      onClick={() =>
        sendTrack({
          eventName: "click-organization-card",
          eventValue: {
            href: organization.slug,
            from: "organization list",
          },
        })
      }
    >
      <div className="rounded-xl border p-6 cursor-pointer h-full flex flex-row items-center justify-center md:flex-col">
        {organization.logoUrl && (
          <div className="relative w-2/4 md:h-3/4 max-h-12 mx-auto">
            <Image
              className="object-contain h-full max-h-12 mx-auto"
              src={organization.logoUrl}
              alt={`${organization.name}'s logo`}
              width={124}
              height={50}
              sizes="(max-width: 750px) 256px, (max-width: 768px) 300px, 300px"
              autoFormat
            />
          </div>
        )}
        <h2
          className={clsx(
            "w-3/4 tracking-wide text-gray-600 md:text-center text-lg border-l md:border-l-0 ml-4 md:ml-0 pl-4 md:pl-0 font-bold",
            organization.logoUrl && "md:mt-4"
          )}
        >
          {organization.name}
        </h2>
      </div>
    </Link>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const organizations = await wfetch.get("/organization/all").json();
  const parseResult = z
    .array(
      z.object({
        name: z.string(),
        logoUrl: z.string().nullable(),
        slug: z.string(),
        status: z.string(),
        id: z.string(),
      })
    )
    .safeParse(organizations);
  const validOrganizations = parseResult.data;

  if (parseResult.error) {
    throw new Error("Organization API valid failed");
  }
  return {
    props: {
      organizations: validOrganizations,
      headMetas: {
        title: "展商列表",
        des: `欢迎来到FEC·兽展日历！FEC·兽展日历共收录来自中国大陆的 ${validOrganizations?.length} 个和“furry”，“兽展”，“兽人控”等主题相关的展商，我们真挚感谢这些为兽人文化发展做出贡献的团体，今天的繁荣离不开你们的支持！`,
        link: "https://www.furryeventchina.com/organization",
      },
      structuredData: {
        breadcrumb: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "展商",
              item: "https://www.furryeventchina.com/organization/",
            },
          ],
        },
      },
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 86400,
  };
}
