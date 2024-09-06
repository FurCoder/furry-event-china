import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

wretch.options({ mode: "cors" });

const HOST =
  process.env.NEXT_PUBLIC_REGION === "CN"
    ? "https://api.furrycons.cn"
    : "https://api.furryeventchina.com";

const wfetch = wretch(HOST, { cache: "default" })
  .auth(`Bearer ${process.env.FEC_API_TOKEN}`)
  .addon(QueryStringAddon);
export default wfetch;
