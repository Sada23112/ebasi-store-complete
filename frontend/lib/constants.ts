export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export const STORE_INFO = {
  name: "Ms Ebasi Store",
  brandName: "EBASI STORE",
  enterpriseName: "EBASI ENTERPRISE",
  businessType: "Boutique / Clothing brand",
  phone: "073992 91242",
  phoneRaw: "917399291242",
  phoneDisplay: "+91 73992 91242",
  whatsappUrl: "https://wa.me/917399291242",
  address: {
    street: "Railway, Station Rd, opposite Parmananda Academy",
    locality: "Nagakhelia No.2",
    city: "Dhemaji",
    state: "Assam",
    postalCode: "787057",
    country: "India",
    full: "Railway, Station Rd, opposite Parmananda Academy, Nagakhelia No.2, Dhemaji, Assam 787057, India",
    plusCode: "FHG4+PH, Dhemaji, Assam",
  },
  instagram: {
    handle: "@ebasistore_traditionalattire",
    url: "https://www.instagram.com/ebasistore_traditionalattire/",
  },
  youtube: {
    handle: "Ms Ebasi Store",
    url: "https://www.youtube.com/channel/UCjcFLd3hbc2uexKAQxh7wyQ",
  },
  facebook: {
    handle: "Twinkle Deori (Ebasi Store)",
    url: "https://www.facebook.com/twinkledeori21/#",
  },
  specialties: [
    "Deori Egu-Jokasiba",
    "Mekhela Sador",
    "Traditional Sarees",
    "Gamusa",
    "Handloom Silk & Cotton",
  ],
  policies: {
    payment: "Prepaid via UPI / Direct WhatsApp Order (No COD)",
    dispatch: "Dispatched directly from Dhemaji, Assam",
  },
  maps: {
    embedUrl: "https://maps.google.com/maps?q=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057",
  },
} as const;
