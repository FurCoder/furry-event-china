export function sendTrack({
  eventName,
  eventValue,
}: {
  eventName: string;
  eventValue: { [key: string]: unknown };
}) {
  if (process.env.NODE_ENV !== "production") {
    return console.info("Send Track", eventName, eventValue);
  }
  window.gtag && window.gtag("event", eventName, eventValue);
  window.mixpanel?.track(eventName, eventValue);
}

declare global {
  interface Window {
    gtag: Function | undefined;
    mixpanel: { track: Function } | undefined;
    TMap: any | undefined;
  }
}
