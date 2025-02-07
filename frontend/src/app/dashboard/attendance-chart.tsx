"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Mon",
    total: 4,
  },
  {
    name: "Tue",
    total: 3,
  },
  {
    name: "Wed",
    total: 5,
  },
  {
    name: "Thu",
    total: 4,
  },
  {
    name: "Fri",
    total: 5,
  },
  {
    name: "Sat",
    total: 2,
  },
  {
    name: "Sun",
    total: 0,
  },
]

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

