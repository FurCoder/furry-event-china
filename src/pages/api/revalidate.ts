import { NextApiRequest, NextApiResponse } from "next";

const simpleToken = process.env.XATA_API_KEY?.slice(0, 6);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = req.headers.authorization;

  if (auth !== simpleToken) {
    return res.status(401).json({ message: "Invalid token." });
  }
  const payload = req.body;

  const { pathname } = payload;

  if (typeof pathname !== "string") {
    return res.status(401).json({ message: "Invalid path." });
  }

  try {
    await res.revalidate(pathname);
    return res.json({ revalidated: true, revalidatedPath: pathname });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
