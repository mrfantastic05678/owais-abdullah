"use client";
import React from 'react'
import { Timeline } from './ui/Timeline';
import { work } from '@/data/profile';

const experienceData = work.map((entry) => ({
  title: entry.end === entry.start ? entry.start : `${entry.start} - ${entry.end}`,
  content: (
    <div>
      <h3 className="text-xl font-bold text-foreground">{entry.title}</h3>
      <p className="text-sm text-accent">{entry.company}</p>
      <p className="text-muted-foreground text-xs md:text-sm font-normal mt-2">
        {entry.description}
      </p>
    </div>
  ),
}));

const Experience = () => {
  return  (
    <div className="w-full">
      <Timeline data={experienceData} />
    </div>
  );
}

export default Experience
