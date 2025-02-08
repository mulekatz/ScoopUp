export interface Submission {
  _id?: string;
  round?: number;
  address: string;
  timestamp: number;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  deviceID?: string;
}
