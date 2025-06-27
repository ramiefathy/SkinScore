
"use client";

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function AdBanner() {
  useEffect(() => {
    try {
      // This is necessary to initialize the ad unit.
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="my-8">
      <Card className="shadow-lg border-2 border-primary/20 transition-all min-h-[160px] flex items-center justify-center bg-muted/30">
        <CardContent className="p-2 w-full">
          {/* 
            This is your Google AdSense ad unit.
            1. Replace 'ca-pub-0000000000000000' with your real AdSense Publisher ID.
            2. Replace '0000000000' with your real Ad Slot ID.
            You can create new ad units in your AdSense account.
          */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-0000000000000000" // IMPORTANT: Replace with your AdSense Publisher ID
            data-ad-slot="0000000000"                 // IMPORTANT: Replace with your Ad Slot ID
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </CardContent>
      </Card>
    </div>
  );
}
