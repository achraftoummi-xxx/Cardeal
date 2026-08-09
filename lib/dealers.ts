import { supabase } from "@/lib/supabase";

export type Dealer = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  phone: string | null;
  google_rating: number | null;
  review_count: number | null;
};

export async function fetchDealers(): Promise<Dealer[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Dealer[];
}
