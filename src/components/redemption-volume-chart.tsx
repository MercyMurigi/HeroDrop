"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Jan", volume: 186 },
  { month: "Feb", volume: 305 },
  { month: "Mar", volume: 237 },
  { month: "Apr", volume: 273 },
  { month: "May", volume: 209 },
  { month: "Jun", volume: 214 },
]

const chartConfig = {
  volume: {
    label: "Tokens Redeemed",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RedemptionVolumeChart() {
  return (
     <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                dataKey="volume"
                type="monotone"
                stroke="var(--color-volume)"
                strokeWidth={2}
                dot={true}
                />
            </LineChart>
        </ChartContainer>
     </div>
  )
}
