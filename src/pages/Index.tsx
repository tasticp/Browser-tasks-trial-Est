import { useEffect } from "react";
import TrailBrowser from "@/components/TrailBrowser";

const Index = () => {
  useEffect(() => {
    document.title = "Arc Trail Tabs — Collapsible Child Tabs";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Arc-like trail browsing: open links as child tabs with collapsible levels.");
  }, []);

  return <TrailBrowser />;
};

export default Index;
