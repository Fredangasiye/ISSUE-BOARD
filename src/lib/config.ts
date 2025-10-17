// Airtable Configuration
export const AIRTABLE_CONFIG = {
  API_KEY: process.env.AIRTABLE_API_KEY || process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY",
  BASE_ID: process.env.AIRTABLE_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || "appf13MlVsEMdFTKh",
  TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || "Issues 2",
};

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzi76k3l5",
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "676222665382731",
  UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
};