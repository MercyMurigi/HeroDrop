"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";

const data = [
  { date: "Week 1", donations: 12 },
  { date: "Week 2", donations: 15 },
  { date: "Week 3", donations: 10 },
  { date: "Week 4", donations: 18 },
  { date: "Week 5", donations: 13 },
  { date: "Week 6", donations: 22 },
  { date: "Week 7", donations: 19 },
]

const chartConfig = {
  donations: {
    label: "Donations",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function WeeklyDonationsChart() {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
            <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="donations" fill="var(--color-donations)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
