import Timeline, { TimelineOptions } from "./timeline";

export default function TimelinePage() {
  const nextMonth = new Date().setMonth(
    new Date().getMonth() + 1 > 11 ? 0 : new Date().getMonth() + 1
  );
  const timelineOptions: TimelineOptions = {
    layout: "horizontal",
    transactions: [
      {
        id: "1",
        date: Date.now(),
        amount: 100,
        type: "income",
        subtype: "salary",
      },
      {
        id: "2",
        date: nextMonth,
        amount: 100,
        type: "income",
        subtype: "salary",
      },
      {
        id: "3",
        date: Date.now(),
        amount: -100,
        type: "expense",
        subtype: "transfer",
      },
    ],
  };

  return (
    <div>
      <Timeline options={timelineOptions} />
    </div>
  );
}
