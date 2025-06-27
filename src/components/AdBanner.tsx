
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AdBanner() {
  return (
    <div className="my-8">
      <Card className="shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all">
        <CardContent className="p-0">
          <Link href="#" className="flex flex-col md:flex-row items-center group">
            <div className="relative w-full md:w-1/3 h-48 md:h-auto md:min-h-[160px] overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-r-none">
              <Image
                src="https://placehold.co/400x250.png"
                alt="Advertisement placeholder"
                layout="fill"
                objectFit="cover"
                data-ai-hint="advertisement billboard"
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <Badge variant="secondary" className="absolute top-2 right-2">Ad</Badge>
            </div>
            <div className="flex-1 p-6 space-y-2">
              <h3 className="text-xl font-bold text-primary">Your Advertisement Here!</h3>
              <p className="text-muted-foreground">
                Promote your product or service to a targeted audience of healthcare professionals. High visibility, great value.
              </p>
              <div className="flex items-center text-sm font-semibold text-primary group-hover:underline">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
