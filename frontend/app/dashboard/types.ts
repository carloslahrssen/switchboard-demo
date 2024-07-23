export type Donation = {
  donor_firstname: string;
  donor_lastname: string;
  refcode: string;
  contribution_form: string;
  status: "approved" | string;
  committee_name: string;
  form_name: string;
  form_managing_entity_name: string;
  recurring_period: string;
  recurring_duration: string;
  paid_at: string;
  amount: string;
  order_number: string;
  created_at: string;
};
