
import { useState } from 'react';
import { calculateCorporationTax, formatCurrency, formatPercentage } from '@/utils/calculators';
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
import { PoundSterling, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CorporationTaxForm {
  profits: number;
  associatedCompanyCount: number;
  accountingPeriodMonths: number;
}

export function CorporationTaxCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateCorporationTax> | null>(null);

  const form = useForm<CorporationTaxForm>({
    defaultValues: {
      profits: 0,
      associatedCompanyCount: 0,
      accountingPeriodMonths: 12,
    },
  });

  const onSubmit = (data: CorporationTaxForm) => {
    const calculationResult = calculateCorporationTax(
      data.profits,
      data.associatedCompanyCount,
      data.accountingPeriodMonths
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Corporation Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Profits</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <PoundSterling className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter company profits"
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
              name="associatedCompanyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Associated Companies</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of associated companies"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of companies in the same group (excluding this company)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountingPeriodMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accounting Period (months)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Accounting period length in months"
                      min="1"
                      max="12"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Length of the accounting period in months (1-12)
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
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Taxable Profit</p>
                <p className="font-semibold">{formatCurrency(result.taxableProfit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tax Rate</p>
                <p className="font-semibold">{formatPercentage(result.taxRate)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Corporation Tax</p>
                <p className="font-semibold text-lg">{formatCurrency(result.corporationTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit After Tax</p>
                <p className="font-semibold text-lg">{formatCurrency(result.profitAfterTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Tax Rate</p>
                <p className="font-semibold text-lg">{formatPercentage(result.effectiveTaxRate)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
