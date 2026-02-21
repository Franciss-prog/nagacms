"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TrendChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  title: string;
  description?: string;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  xAxisKey?: string;
}

export function TrendChart({
  data,
  title,
  description,
  dataKeys,
  xAxisKey = "name",
}: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={dk.color}
                name={dk.name}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface BarChartMetricsProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  title: string;
  description?: string;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  xAxisKey?: string;
}

export function BarChartMetrics({
  data,
  title,
  description,
  dataKeys,
  xAxisKey = "name",
}: BarChartMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                fill={dk.color}
                name={dk.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface AreaChartMetricsProps {
  data: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  title: string;
  description?: string;
  dataKey: string;
  color: string;
}

export function AreaChartMetrics({
  data,
  title,
  description,
  dataKey,
  color,
}: AreaChartMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill="url(#colorData)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PieCharDistributionProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  description?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

export function PieChartDistribution({
  data,
  title,
  description,
  colors = DEFAULT_COLORS,
}: PieCharDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Health Activities by Barangay
 */
interface BarangayComparisonProps {
  data: Array<{
    barangay: string;
    vaccinations: number;
    maternalVisits: number;
    seniorAssistance: number;
  }>;
}

export function BarangayComparison({ data }: BarangayComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Activities by Barangay</CardTitle>
        <CardDescription>
          Comparison of health interventions across barangays
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="barangay" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vaccinations" fill="#3b82f6" name="Vaccinations" />
            <Bar
              dataKey="maternalVisits"
              fill="#ec4899"
              name="Maternal Visits"
            />
            <Bar
              dataKey="seniorAssistance"
              fill="#f59e0b"
              name="Senior Assistance"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
