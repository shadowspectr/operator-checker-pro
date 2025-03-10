
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { OperatorSummary } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OperatorChartProps {
  data: OperatorSummary[];
}

const OperatorChart: React.FC<OperatorChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-100">
          <p className="font-medium">{item.operator}</p>
          <p className="text-sm text-telecom-gray">Количество: {item.count}</p>
          <p className="text-sm text-telecom-gray">Процент: {item.percentage.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="telecom-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center text-xl">Распределение по операторам</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={30}
                fill="#8884d8"
                dataKey="count"
                nameKey="operator"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatorChart;
