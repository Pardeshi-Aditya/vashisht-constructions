export const company = {
  name: "Vashisht Constructions",
  tagline: "Crafted for Living",
  shortDescription:
    "A luxury architecture and construction studio shaping timeless spaces across India.",
  founded: 2008,
  website: "https://sterlingbuild.co",
  email: "vashishtconstructions2304@gmail.com",
  phone: "+91 9421889619",
  phoneDisplay: "+91 9421889619",
  whatsapp: "919421889619",
  address: {
    line1: "Plot no.9, Vashisht Constructions, Riddhi Siddhi Apartment",
    line2: "Kothari Nagar, Karvand Road",
    country: "Shirpur, Maharashtra, India",
  },
  coordinates: {
    lat: 18.9432,
    lng: 72.8235,
  },
  social: {
    instagram: "https://instagram.com/vashisht_constructions",
    linkedin: "https://linkedin.com/company/sterlingbuildco",
    facebook: "https://facebook.com/sterlingbuildco",
  },
  hours: "All Days, 9:00 AM – 9:00 PM",
} as const;

export const about = {
  headline: ["Spaces", "Shaped", "With", "Intention"],
  intro:
    "For over fifteen years, Vashisht Constructions has been crafting residences and commercial environments that honour both architecture and the people who inhabit them. We believe exceptional building is a quiet discipline — measured, deliberate, and enduring.",
  story:
    "Vashisht Constructions began with a single residential project in South Mumbai and a conviction that Indian construction could meet the highest global standards. What started as a boutique studio has grown into a trusted name for discerning homeowners, developers, and institutions who value craftsmanship over compromise.",
  mission:
    "To create built environments that elevate daily life through thoughtful design, uncompromising quality, and sustainable practices — delivering spaces that feel as considered years from now as they do on the day of handover.",
  vision:
    "To be recognised as India's most trusted luxury builder — known not for volume, but for the enduring quality of every structure we create and every relationship we honour.",
  history:
    "From our first villa in 2008 to landmark commercial developments today, our journey has been defined by a refusal to cut corners. Each project adds to a portfolio that speaks for itself — quiet, confident, and built to last.",
} as const;

export const stats = [
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 48, suffix: "", label: "Projects Delivered" },
  { value: 2.4, suffix: "M", label: "Sq. Ft. Constructed", decimals: 1 },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
] as const;

export const whyChooseUs = [
  {
    title: "Architectural Integrity",
    description:
      "Every structure begins with design intent. We collaborate with leading architects to ensure form and function remain inseparable.",
  },
  {
    title: "Uncompromising Quality",
    description:
      "From foundation to finishing, we source premium materials and employ skilled craftspeople who take pride in their work.",
  },
  {
    title: "Transparent Process",
    description:
      "Clear timelines, honest communication, and detailed progress updates keep you informed at every stage of construction.",
  },
  {
    title: "Timely Delivery",
    description:
      "Our project management systems ensure milestones are met without sacrificing the standards that define our name.",
  },
] as const;

export const timeline = [
  {
    year: "2008",
    title: "Foundation",
    description:
      "Vashisht Constructions established in Shirpur with a focus on bespoke residential villas.",
  },
  {
    year: "2012",
    title: "First Commercial",
    description:
      "Completed our first commercial office development in Bandra Kurla Complex.",
  },
  {
    year: "2016",
    title: "Green Certification",
    description:
      "Adopted IGBC green building standards across all new residential projects.",
  },
  {
    year: "2019",
    title: "Pan-India Expansion",
    description:
      "Extended operations to Pune, Bengaluru, and Goa with dedicated regional teams.",
  },
  {
    year: "2023",
    title: "Landmark Portfolio",
    description:
      "Crossed 40 completed projects and 2 million square feet of premium construction.",
  },
] as const;

export const footer = {
  headline: "Let's build something enduring.",
  description:
    "Whether you envision a private residence or a commercial landmark, we invite you to begin the conversation.",
  copyright: `© ${new Date().getFullYear()} Vashisht Constructions All rights reserved.`,
} as const;
