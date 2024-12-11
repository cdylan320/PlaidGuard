"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { dollarFormatter, numberFormatter, sumArray } from "../../../../utils/util";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Title } from "@tremor/react";
import { colors } from "@/lib/utils";

interface MonthlySpendProps {
  selectedKpi: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  filterCreditCards: boolean | string;
}

const MonthlySpend: React.FC<MonthlySpendProps> = ({
  selectedKpi,
  selectedIndex,
  setSelectedIndex,
  filterCreditCards,
}) => {
  const { monthlySpend, monthlySpendNoCards } = useSelector(
    (state: any) => state.user
  );

  const chartConfig = useMemo(
    () => ({
      spend: {
        label: selectedKpi === "spend" ? "Spend" : "Count",
        color: colors[0],
      },
      moneyIn: {
        label: selectedKpi === "spend" ? "MoneyIn" : "MoneyInCount",
        color: colors[3],
      },
    }),
    [selectedKpi]
  );

  const calculatedAveragesMonthly = useMemo(() => {
    let totalSpend = 0;
    let totalMoneyIn = 0;
    let totalTransactions = 0;
    const numberOfMonths =
      filterCreditCards === true
        ? monthlySpendNoCards?.length || 0
        : monthlySpend?.length || 0;

    for (let i = 0; i < numberOfMonths; i++) {
      const data = filterCreditCards ? monthlySpendNoCards[i] : monthlySpend[i];
      if (data) {
        totalSpend += data.spend || 0;
        totalMoneyIn += data.moneyIn || 0;
        totalTransactions += data.count || 0;
      }
    }

    const averageMonthlySpend = totalSpend / numberOfMonths || 0;
    const averageMonthlyMoneyIn = totalMoneyIn / numberOfMonths || 0;
    const avgTransaction = totalTransactions / numberOfMonths || 0;

    return {
      averageMonthlySpend,
      averageMonthlyMoneyIn,
      avgTransaction,
    };
  }, [monthlySpend, monthlySpendNoCards, filterCreditCards]);

  const { averageMonthlySpend, avgTransaction } = calculatedAveragesMonthly;

  return (
    <Card className="p-4 bg-background">
      <div className="md:flex justify-between">
        <div>
          <div className="flex items-center space-x-2">
          <Title>Monthly Spend</Title>
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  Shows total spend for each month
                </TooltipContent>
                <Info size={18} />
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Spend calculated for each month
          </p>
          <div className="flex flex-col gap-2">
          <h3 className="text-lg mt-2 p-2 border rounded-md">
            Avg {""}
            {selectedKpi === "spend"
              ? dollarFormatter(averageMonthlySpend)
              : numberFormatter(avgTransaction)} {" / month"}
          </h3>
          </div>
        </div>
        <Tabs
          defaultValue={selectedIndex === 0 ? "dollars" : "transactions"}
          onValueChange={(value) =>
            setSelectedIndex(value === "dollars" ? 0 : 1)
          }
        >
          <TabsList>
            <TabsTrigger value="dollars">Dollars</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-8 overflow-auto">
        <ChartContainer className="mt-5 h-40 w-full" config={chartConfig}>
          <BarChart
            data={filterCreditCards ? monthlySpendNoCards : monthlySpend}
            margin={{
              left: 12,
              right: 12,
            }}
            className="w-full"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={selectedKpi === "spend" ? dollarFormatter : numberFormatter}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar
              dataKey={selectedKpi === "spend" ? "spend" : "count"}
              fill={chartConfig.spend.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey={selectedKpi === "spend" ? "moneyIn" : "moneyInCount"}
              fill={chartConfig.moneyIn.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default MonthlySpend;
