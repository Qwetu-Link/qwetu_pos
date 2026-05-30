import React from "react";
import type { Metadata } from "next";
import ProfileAccPage from "./_components/profile_page";

export const metadata: Metadata = {
  title: "Profile | QwetuLinks Clothing POS",
  description: "Profile workspace for the QwetuLinks clothing store account.",
};

export default function ProfilePage() {
  return <ProfileAccPage />;
}
