
import { useState } from 'react';
import { calculateDividendTax, formatCurrency, formatPercentage } from '@/utils/calculators';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { Pound, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DividendTaxForm {
  dividendAmount: number;
  otherIncome: number;
}

export function DividendTaxCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateDividendTax> | null>(null);

  const form = useForm<DividendTaxForm>({
    defaultValues: {
      dividendAmount: 0,
      otherIncome: 0,
    },
  });

  const onSubmit = (data: DividendTaxForm) => {
    const calculationResult = calculateDividendTax(
      data.dividendAmount,
      data.otherIncome
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Dividend Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dividendAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dividend Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter total dividend amount"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter other income (e.g., salary)"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Other income affects your tax bands (e.g., salary, pension)
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Calculate Tax
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md space-y-4">
            <h4 className="font-medium text-lg">Results</h4>
            
            <div>
              <p className="text-sm text-gray-600">Taxable Dividends (after £1,000 allowance)</p>
              <p className="font-semibold">{formatCurrency(result.taxableDividends)}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h5 className="font-medium">Dividend Tax Breakdown</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Basic Rate (8.75%)</p>
                  <p className="font-semibold">{formatCurrency(result.basicRateTax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Higher Rate (33.75%)</p>
                  <p className="font-semibold">{formatCurrency(result.higherRateTax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Additional Rate (39.35%)</p>
                  <p className="font-semibold">{formatCurrency(result.additionalRateTax)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Total Dividend Tax</p>
                <p className="font-semibold text-lg">{formatCurrency(result.totalDividendTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Tax Rate</p>
                <p className="font-semibold text-lg">{formatPercentage(result.effectiveTaxRate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Dividend (After Tax)</p>
                <p className="font-semibold text-lg">{formatCurrency(result.netDividend)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
