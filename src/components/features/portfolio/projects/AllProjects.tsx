"use client";
import { Card, Carousel } from "./apple-cards-carousel";
import { data } from "./Data";


export default function AllProjects() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));
  console.log(data[0]);

  return (
    <div className="w-full h-full pt-8">
      <h2 className="max-w-7xl mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Games I've Worked On
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
