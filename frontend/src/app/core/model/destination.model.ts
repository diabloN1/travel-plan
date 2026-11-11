export type DestinationType =
  | 'ACTIVITIES'
  | 'ACCOMODATION'
  | 'BOTH'
  | 'OTHER';

export interface DestinationRequest {
  name: string;
  country?: string | null;
  city?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type: DestinationType;
}

export interface DestinationResponse {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  type: DestinationType;
  activities: ActivitySummaryResponse[];
}

export interface ActivitySummaryResponse {
  id: string;
  title: string;
  description: string | null;
}