
import { useState } from 'react';
import { calculateCapitalGainsTax, formatCurrency, formatPercentage } from '@/utils/calculators';
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
import { Switch } from "@/components/ui/switch";
import { useForm } from 'react-hook-form';
import { Pound, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CapitalGainsTaxForm {
  acquisitionPrice: number;
  disposalPrice: number;
  acquisitionCosts: number;
  disposalCosts: number;
  annualIncome: number;
  isResidentialProperty: boolean;
}

export function CapitalGainsTaxCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateCapitalGainsTax> | null>(null);

  const form = useForm<CapitalGainsTaxForm>({
    defaultValues: {
      acquisitionPrice: 0,
      disposalPrice: 0,
      acquisitionCosts: 0,
      disposalCosts: 0,
      annualIncome: 30000,
      isResidentialProperty: false,
    },
  });

  const onSubmit = (data: CapitalGainsTaxForm) => {
    const calculationResult = calculateCapitalGainsTax(
      data.acquisitionPrice,
      data.disposalPrice,
      data.acquisitionCosts,
      data.disposalCosts,
      data.annualIncome,
      data.isResidentialProperty
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Capital Gains Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="acquisitionPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acquisition Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Pound className="h-4 w-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter purchase price"
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
                name="disposalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Pound className="h-4 w-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter selling price"
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="acquisitionCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acquisition Costs</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Pound className="h-4 w-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter costs when buying"
                          className="pl-9"
                          step="1"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Costs such as stamp duty, legal fees, etc.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disposalCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Costs</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Pound className="h-4 w-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter costs when selling"
                          className="pl-9"
                          step="1"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Costs such as agent fees, legal fees, etc.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter your annual income"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This affects your tax band for Capital Gains Tax
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isResidentialProperty"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Residential Property</FormLabel>
                    <FormDescription>
                      Is this a residential property (higher tax rates apply)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                <p className="text-sm text-gray-600">Total Gain</p>
                <p className="font-semibold">{formatCurrency(result.gain)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxable Gain (after £3,000 allowance)</p>
                <p className="font-semibold">{formatCurrency(result.taxableGain)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h5 className="font-medium">CGT Breakdown</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Basic Rate CGT</p>
                  <p className="font-semibold">{formatCurrency(result.basicRateCGT)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Higher Rate CGT</p>
                  <p className="font-semibold">{formatCurrency(result.higherRateCGT)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Total Capital Gains Tax</p>
                <p className="font-semibold text-lg">{formatCurrency(result.totalCGT)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective CGT Rate</p>
                <p className="font-semibold text-lg">{formatPercentage(result.effectiveCGTRate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Proceeds After Tax</p>
                <p className="font-semibold text-lg">{formatCurrency(result.netProceeds)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
