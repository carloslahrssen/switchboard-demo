import { cache } from "react";
import csv from "csvtojson";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { Donation } from "./types";
import { DonationAggregate } from "./donation-aggregate";
import { PageProps } from "@/.next/types/app/dashboard/page";
import { getRecentByDate } from "@/lib/utils";

const getDonations = cache(async () => {
  const data = await donationsCsvToJson(
    process.cwd() + "/app/dashboard/donations.csv"
  );

  const sortedByNew = sortDonations(data);
  return sortedByNew;
});

async function donationsCsvToJson(filepath: string) {
  const data = await csv().fromFile(filepath);

  return data;
}

async function sortDonations(data: Donation[]) {
  const sortedData = data.sort((a, b) => {
    return Number(new Date(b.created_at)) - Number(new Date(a.created_at));
  });

  return sortedData;
}

function calculateAggregateAmount(data: Donation[], duration: number) {
  let aggregateData = data;
  if (duration && aggregateData) {
    if (duration > 0) {
      aggregateData = getRecentByDate(
        aggregateData,
        duration,
        aggregateData[0]
      );
    }
  }

  const amount = aggregateData.reduce((total, donation) => {
    return total + Number(donation.amount);
  }, 0);

  return amount;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { duration } = searchParams;
  const data = await getDonations();
  const aggregateAmount = calculateAggregateAmount(data, duration);
  const latestDonation = data[0];

  return (
    <main className="flex justify-center pt-24">
      <div className="px-2 max-w-[400px] md:max-w-[950px]">
        <DonationAggregate
          amount={aggregateAmount}
          duration={duration}
          donationDate={latestDonation.paid_at}
        />
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
