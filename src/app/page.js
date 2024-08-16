"use client";

import ProductPage from "@/pages/product/[id]";
import "./globals.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.assign(`/product/1`);
  });
  return <></>;
}
