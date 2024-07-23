"use client";

import { useMemo } from "react";
import { formatToUSDollar } from "@/lib/utils";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface DonationAggregateProps {
  amount: number;
  duration: number;
  donationDate: string;
}
export function DonationAggregate({
  amount,
  duration,
  donationDate,
}: DonationAggregateProps) {
  const router = useRouter();

  const tagline = useMemo(() => {
    if (Number(duration)) {
      return (
        <>
          <span className="font-light italic">
            {duration} day{Number(duration) === 1 ? null : "s"} since the latest
            donation({new Date(donationDate).toLocaleDateString()}){" "}
          </span>
          <span className="font-semibold">
            {formatToUSDollar().format(amount)}
          </span>{" "}
          was donated
        </>
      );
    }

    return (
      <>
        Your all time aggregated amount was{" "}
        <span className="font-semibold">
          {" "}
          {formatToUSDollar().format(amount)}{" "}
        </span>
      </>
    );
  }, [duration, amount, donationDate]);

  const setDuration = (duration: number | null) => {
    router.push(`/dashboard?duration=${duration}`);
  };

  return (
    <div className="pb-4 md:w-[450px]">
      <Card>
        <CardHeader>
          <h1 className="text-xl">{tagline}</h1>
        </CardHeader>
        <CardFooter className="flex flex-col justify-end">
          <Separator className="my-4" />
          <div className="*:mx-1">
            <Button variant="outline" onClick={() => setDuration(1)}>
              1 Day
            </Button>
            <Button variant="outline" onClick={() => setDuration(7)}>
              7 Days
            </Button>
            <Button variant="outline" onClick={() => setDuration(0)}>
              All time
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
