import { Donation } from "@/app/dashboard/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToUSDollar() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
}

export const getRecentByDate = (collection: Donation[], days: number, lastDonationDate: Donation): Donation[] => {
  const endDate = new Date(lastDonationDate.paid_at)
  const currentDate = new Date(lastDonationDate.paid_at)
  currentDate.setDate(currentDate.getDate() - days)

  const filtered = collection.filter((donation) => {
    const donationDate = new Date(donation.paid_at)

    return Number(donationDate) >= Number(currentDate) && donationDate <= endDate
  })
  

  return filtered
};