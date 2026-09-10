/**
 * Contact page default content (fallback when DB empty / seed source).
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin must not use this for live CMS counts.
 */

export type ContactOffice = {
  city: string;
  lines: string[];
  phone: string;
  email: string;
};

export type ContactInquiry = {
  label: string;
  email?: string;
  phone?: string;
  lines?: string[];
};

export type ContactContent = {
  title: string;
  inquiries: ContactInquiry[];
  offices: ContactOffice[];
  socials: string[];
  officesHeading: string;
};

export const CONTACT_DEFAULTS: ContactContent = {
  title: "Get in touch",
  officesHeading: "Let's Work Together",
  inquiries: [
    {
      label: "Inquiries",
      email: "hello@getpixoria.com",
    },
    {
      label: "Raleigh",
      lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
    },
    {
      label: "Raleigh",
      lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
    },
  ],
  offices: [
    {
      city: "London",
      lines: ["28 Foubert’s Place", "London W1F 7PR"],
      phone: "+44 (0)20 3667 7446",
      email: "hello@getpixoria.com",
    },
    {
      city: "New York",
      lines: ["28 Foubert’s Place", "London W1F 7PR"],
      phone: "+44 (0)20 3667 7446",
      email: "hello@getpixoria.com",
    },
    {
      city: "Singapore",
      lines: ["28 Foubert’s Place", "London W1F 7PR"],
      phone: "+44 (0)20 3667 7446",
      email: "hello@getpixoria.com",
    },
  ],
  socials: ["LinkedIn", "Instagram", "Twitter"],
};
