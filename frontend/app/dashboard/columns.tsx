"use client";
import { formatToUSDollar } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import type { Donation } from "./types";

export const columns: ColumnDef<Donation>[] = [
  {
    id: "refCode",
    header: "Ref Code",
    accessorKey: "refcode",
  },
  {
    id: "fullName",
    header: "Name",
    accessorFn: (row) => `${row.donor_firstname} ${row.donor_lastname}`,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (props) =>
      props.getValue() === "approved" ? (
        <span className="text-green-700 p-2 rounded-sm capitalize font-semibold">
          {" "}
          {String(props.getValue())}{" "}
        </span>
      ) : (
        props.getValue()
      ),
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    cell: (props) => formatToUSDollar().format(Number(props.getValue())),
  },
  {
    id: "paidAt",
    accessorKey: "paid_at",
    header: "Paid at",
    cell: (props) => new Date(String(props.getValue())).toLocaleDateString(),
  },
  {
    id: "committeeName",
    header: "Committee Name",
    accessorKey: "committee_name",
  },
  {
    id: "recurringPeriod",
    header: "Recurring period",
    accessorKey: "recurring_period",
  },
  {
    id: "orderNumber",
    header: "Order Number",
    accessorKey: "order_number",
  },
  {
    id: "contributionForm",
    header: "Contribution Form",
    accessorKey: "contribution_form",
  },
  {
    id: "createdAt",
    header: "Created at",
    accessorKey: "created_at",
    cell: (props) => new Date(String(props.getValue())).toLocaleDateString(),
  },
];
