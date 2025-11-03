import { useEffect } from "react";
import { BrowserWindow } from "@/components/browser/BrowserWindow";

const Index = () => {
  useEffect(() => {
    document.title = "New Browser — Rust-based, Minimal Memory";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "A new browser built with Rust for minimal memory usage. Cross-platform: iOS, Android, Windows, Linux, macOS.");
  }, []);

  // Use Rust backend for minimal memory usage
  // Set useRust={false} to use TypeScript implementation for testing
  return <BrowserWindow engineType="servo" useRust={true} />;
};

export default Index;
