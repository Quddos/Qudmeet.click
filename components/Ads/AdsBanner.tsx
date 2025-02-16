'use client'

import Router from "next/router";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdsBannerProps {
  "data-ad-slot": string;
  "data-ad-format": string;
  "data-full-width-responsive": string;
  "data-ad-layout"?: string;
}

const AdBanner = (props: AdsBannerProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleRouteChange = () => {
      const intervalId = setInterval(() => {
        try {
          // Check if the 'ins' element already has an ad in it
          if (window.adsbygoogle) {
            window.adsbygoogle.push({});
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error pushing ads: ", err);
          clearInterval(intervalId); // Ensure we clear interval on errors too
        }
      }, 100);

      return () => clearInterval(intervalId); // Clear interval on component unmount
    };

    // Run the function when the component mounts
    handleRouteChange();

    // Subscribe to route changes
    if (typeof window !== "undefined") {
      Router.events.on("routeChangeComplete", handleRouteChange);

      // Unsubscribe from route changes when the component unmounts
      return () => {
        Router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  useEffect(() => {
    const handleAdError = (e: Event) => {
      console.error('AdSense error:', e)
      // Implement fallback content or retry logic
    }

    window.addEventListener('error', handleAdError)
    return () => window.removeEventListener('error', handleAdError)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="ad-container">
      {isLoading && <div className="ad-placeholder animate-pulse" />}
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: "block",
          overflow: "hidden",
          minHeight: "280px",
          border: process.env.NODE_ENV === "development" ? "1px solid red" : "none",
        }}
        data-adtest="on"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        {...props}
      />
    </div>
  );
};

export default AdBanner; 