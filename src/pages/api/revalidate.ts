import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, pathname } = req.query;
  // Check for secret to confirm this is a valid request
  if (
    typeof process.env.XATA_API_KEY !== "string" ||
    typeof secret !== "string" ||
    typeof pathname !== "string"
  ) {
    return res.status(401).json({ message: "Invalid token or params." });
  }

  const simpleToken = process.env.XATA_API_KEY.slice(0, 6);

  if (secret !== simpleToken) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(pathname);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
