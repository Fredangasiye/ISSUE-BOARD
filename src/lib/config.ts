// Airtable Configuration
export const AIRTABLE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY",
  BASE_ID: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || "appf13MlVsEMdFTKh",
  TABLE_NAME: process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || "Issues",
};