"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  company: string;
  message: string;
  author: string;
  rating?: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <Card className="relative h-full overflow-hidden border border-border/70 bg-white/85 shadow-[0_24px_60px_-32px_rgba(31,125,96,0.32)] backdrop-blur-md transition duration-500 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_32px_72px_-30px_rgba(31,125,96,0.36)] dark:border-border/40 dark:bg-white/[0.08]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-foreground">
                    <span>{testimonial.company}</span>
                    {testimonial.rating && (
                      <div className="flex gap-0.5 text-secondary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-transform duration-300 ${
                              i < testimonial.rating! ? "fill-current" : "opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-base leading-relaxed text-muted-foreground">{testimonial.message}</p>
                  <div className="flex items-center justify-between border-t border-dashed border-border/60 pt-4 text-sm text-muted-foreground dark:border-border/40">
                    <span className="font-semibold text-foreground dark:text-foreground/90">{testimonial.author}</span>
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground">
                      Verifie
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full border-primary/30 hover:bg-primary/10 transition-all hover:scale-110">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Precedent</span>
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Aller au temoignage ${index + 1}`}
            />
          ))}
        </div>

        <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full border-primary/30 hover:bg-primary/10 transition-all hover:scale-110">
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Suivant</span>
        </Button>
      </div>
    </div>
  );
}
