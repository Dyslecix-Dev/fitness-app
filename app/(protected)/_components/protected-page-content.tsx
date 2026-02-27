"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { compareAsc, format } from "date-fns";
import { InfoIcon } from "lucide-react";
import * as motion from "motion/react-client";
import { useAction } from "next-safe-action/hooks";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { type ReactNode } from "react";

import { exampleAction, schema } from "@/actions/example";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { useCounterStore } from "@/providers/counter-store-provider";

const TABS = ["workouts", "nutrition", "wellness"] as const;
type Tab = (typeof TABS)[number];

const TAB_CONTENT: Record<Tab, { heading: string; items: string[] }> = {
  workouts: {
    heading: "Today's Workouts",
    items: ["Morning run — 5km", "Upper body strength — 45 min", "Stretching — 10 min"],
  },
  nutrition: {
    heading: "Today's Nutrition",
    items: ["Breakfast: Oats + banana", "Lunch: Grilled chicken salad", "Dinner: Salmon + veggies"],
  },
  wellness: {
    heading: "Today's Wellness",
    items: ["Sleep: 7.5 hrs", "Meditation: 10 min", "Water: 2.1 L"],
  },
};

export function ProtectedPageContent({ userDetails }: { userDetails: ReactNode }) {
  const { count, incrementCount, decrementCount } = useCounterStore((state) => state);
  const { execute, result } = useAction(exampleAction);

  const [tab, setTab] = useQueryState("tab", parseAsStringLiteral(TABS).withDefault("workouts"));

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event, { submission }) {
      event.preventDefault();
      if (!submission || submission.status !== "success") return;

      execute(submission.value);
    },
  });

  const dates = [new Date(1996, 1, 1), new Date(1996, 9, 14), new Date(2015, 9, 30)];
  const listDates = [...dates].sort(compareAsc).map((date) => <li key={date.toString()}>{format(date, "MM/dd/yyyy")}</li>);

  const { heading, items } = TAB_CONTENT[tab];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`px-4 py-1.5 rounded border text-sm capitalize ${tab === t ? "bg-foreground text-background" : "text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-2">{heading}</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Active tab is synced to the URL: <code>?tab={tab}</code>
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {userDetails}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
      <div className="flex flex-col gap-4">
        <form {...getFormProps(form)} className="flex gap-2">
          <input {...getInputProps(fields.name, { type: "text" })} placeholder="Enter your name" className="border rounded px-3 py-1 text-sm" />
          <button type="submit" className="border rounded px-3 py-1 text-sm">
            Submit
          </button>
        </form>
        {fields.name.errors && <p className="text-sm text-red-500">{fields.name.errors[0]}</p>}
        {result?.data?.message && <p className="text-sm">{result.data.message}</p>}
        {result?.serverError && <p className="text-sm text-red-500">{result.serverError}</p>}
      </div>
      <div>
        Count: {count}
        <hr />
        <button type="button" onClick={incrementCount}>
          Increment Count
        </button>
        <button type="button" onClick={decrementCount}>
          Decrement Count
        </button>
      </div>
      <div>
        <ul>{listDates}</ul>
      </div>
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="w-[100px] h-[100px] bg-[#f5f5f5] rounded-[5px]"
      />
    </div>
  );
}

