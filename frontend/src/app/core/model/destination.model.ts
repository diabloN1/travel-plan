export type DestinationType =
  | 'ACTIVITIES'
  | 'ACCOMODATION'
  | 'OTHER';

export interface DestinationRequest {
  name: string;
  country?: string | null;
  city?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type: DestinationType;
  activities?: ActivityRequest[] | null;
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

export interface ActivityRequest {
  id?: string | null;
  title: string;
  description?: string | null;
}

export interface ActivitySummaryResponse {
  id: string;
  title: string;
  description: string | null;
}