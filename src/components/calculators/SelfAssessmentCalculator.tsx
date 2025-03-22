
import { useState } from 'react';
import { calculateSelfAssessmentTax, formatCurrency, formatPercentage } from '@/utils/calculators';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { PoundSterling, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SelfAssessmentForm {
  income: number;
  expenses: number;
  pensionContributions: number;
}

export function SelfAssessmentCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateSelfAssessmentTax> | null>(null);

  const form = useForm<SelfAssessmentForm>({
    defaultValues: {
      income: 0,
      expenses: 0,
      pensionContributions: 0,
    },
  });

  const onSubmit = (data: SelfAssessmentForm) => {
    const calculationResult = calculateSelfAssessmentTax(
      data.income,
      data.expenses,
      data.pensionContributions
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Self-Assessment Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <PoundSterling className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter your total income"
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
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowable Expenses</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <PoundSterling className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter allowable business expenses"
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
              name="pensionContributions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pension Contributions</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <PoundSterling className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter pension contributions"
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

            <Button type="submit" className="w-full">
              Calculate Tax
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md space-y-4">
            <h4 className="font-medium text-lg">Results</h4>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Taxable Income</p>
                <p className="font-semibold">{formatCurrency(result.taxableIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Personal Allowance</p>
                <p className="font-semibold">{formatCurrency(result.personalAllowance)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h5 className="font-medium">Income Tax Breakdown</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Basic Rate (20%)</p>
                  <p className="font-semibold">{formatCurrency(result.basicRateTax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Higher Rate (40%)</p>
                  <p className="font-semibold">{formatCurrency(result.higherRateTax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Additional Rate (45%)</p>
                  <p className="font-semibold">{formatCurrency(result.additionalRateTax)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Total Income Tax</p>
                <p className="font-semibold">{formatCurrency(result.totalIncomeTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">National Insurance</p>
                <p className="font-semibold">{formatCurrency(result.nationalInsurance)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Total Tax Due</p>
                <p className="font-semibold text-lg">{formatCurrency(result.totalTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Tax Rate</p>
                <p className="font-semibold text-lg">{formatPercentage(result.effectiveTaxRate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Take-Home Amount</p>
                <p className="font-semibold text-lg">{formatCurrency(result.takeHome)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
