"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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

  // Auto-play
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
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <Card className="relative h-full overflow-hidden border-primary/20 bg-card/90 shadow-xl shadow-primary/10 backdrop-blur transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-2 dark:border-primary/30 dark:bg-card/35 dark:shadow-primary/20 card-3d neon-border group">
                <CardHeader>
                  <CardTitle className="text-lg text-primary dark:text-primary-foreground flex items-center justify-between">
                    <span>{testimonial.company}</span>
                    {testimonial.rating && (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-yellow-500 transition-all duration-300 ${
                              i < testimonial.rating!
                                ? "opacity-100 scale-100"
                                : "opacity-30 scale-90"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-base text-muted-foreground leading-relaxed italic">
                    {testimonial.message}
                  </p>
                  <div className="flex items-center justify-between border-t border-dashed border-primary/20 pt-4 text-sm text-muted-foreground dark:border-primary/30">
                    <span className="font-medium">{testimonial.author}</span>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary dark:border-primary/30 dark:bg-primary/25 dark:text-primary-foreground">
                      Avis
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full border-primary/40 hover:bg-primary/10 transition-all hover:scale-110 glow"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full border-primary/40 hover:bg-primary/10 transition-all hover:scale-110 glow"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
