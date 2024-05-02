
// Define an interface for a user
export interface User {
  id: number;
  gender: string;
  title: string | null; 
  full_name: string;
  city: string;
  state: string | null; 
  country: string;
  postcode: number | null; 
  coordinates: any; 
  timezone: any; 
  email: string;
  b_day: string;
  age: number;
  phone: string;
  picture_Large: string | null; 
  picture_thumbnail: string | null; 
  favorite: boolean;
  course: string;
  bg_color: string | null;
  note: string | null;
}
