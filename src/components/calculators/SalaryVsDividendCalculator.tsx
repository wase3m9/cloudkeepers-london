import { useState } from 'react';
import { calculateSalaryVsDividend, formatCurrency, formatPercentage } from '@/utils/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Pound, TrendingUp, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalaryVsDividendForm {
  companySalary: number;
  companyDividend: number;
  companyProfit: number;
}

export function SalaryVsDividendCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateSalaryVsDividend> | null>(null);

  const form = useForm<SalaryVsDividendForm>({
    defaultValues: {
      companySalary: 12570, // Default to personal allowance
      companyDividend: 50000,
      companyProfit: 62570, // Sum of the above
    },
  });

  // Keep profit in sync with salary + dividend
  const watchSalary = form.watch("companySalary");
  const watchDividend = form.watch("companyDividend");
  
  const onSubmit = (data: SalaryVsDividendForm) => {
    const calculationResult = calculateSalaryVsDividend(
      data.companySalary,
      data.companyDividend,
      data.companyProfit
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Salary vs Dividend Calculator</CardTitle>
        <CardDescription>
          Compare taking income as salary versus dividends as a company director
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companySalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter salary amount"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          
                          // Update profit automatically
                          const currentDividend = form.getValues("companyDividend");
                          form.setValue("companyProfit", value + currentDividend);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Often optimal to set this to the personal allowance (£12,570)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyDividend"
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
                        placeholder="Enter dividend amount"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          
                          // Update profit automatically
                          const currentSalary = form.getValues("companySalary");
                          form.setValue("companyProfit", currentSalary + value);
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Profit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter total company profit"
                        className="pl-9"
                        step="1"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Total available profit before salary and dividends
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Compare Options
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-6 space-y-4">
            <Tabs defaultValue="comparison">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="salary">Salary Details</TabsTrigger>
                <TabsTrigger value="dividend">Dividend Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison" className="p-4 bg-gray-50 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-center p-4 bg-white rounded shadow-sm flex-1">
                    <h5 className="font-medium mb-1">Salary Take-Home</h5>
                    <p className="text-xl font-bold">{formatCurrency(result.salaryTakeHome)}</p>
                    <p className="text-sm text-gray-600">
                      Effective Rate: {formatPercentage(result.salaryTaxRate)}
                    </p>
                  </div>
                  
                  <div className="px-4">
                    <ArrowRight className={`h-6 w-6 ${result.mostEfficient === 'dividend' ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded shadow-sm flex-1">
                    <h5 className="font-medium mb-1">Dividend Take-Home</h5>
                    <p className="text-xl font-bold">{formatCurrency(result.dividendTakeHome)}</p>
                    <p className="text-sm text-gray-600">
                      Effective Rate: {formatPercentage(result.dividendTaxRate)}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <h5 className="font-medium mb-1">Most Efficient Option:</h5>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <p className="text-lg font-bold capitalize">
                      {result.mostEfficient} Route
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You save {formatCurrency(Math.abs(result.difference))} by choosing the {result.mostEfficient} route
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="salary" className="p-4 bg-gray-50 rounded-md space-y-4">
                <h4 className="font-medium text-lg">Salary Route Breakdown</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Employer's NI</p>
                    <p className="font-semibold">{formatCurrency(result.salaryEmployerNI)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Income Tax</p>
                    <p className="font-semibold">{formatCurrency(result.salaryIncomeTax)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee's NI</p>
                    <p className="font-semibold">{formatCurrency(result.salaryEmployeeNI)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tax</p>
                    <p className="font-semibold">{formatCurrency(result.totalSalaryTax)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Take-Home Amount</p>
                    <p className="font-semibold text-lg">{formatCurrency(result.salaryTakeHome)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Effective Tax Rate</p>
                    <p className="font-semibold text-lg">{formatPercentage(result.salaryTaxRate)}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dividend" className="p-4 bg-gray-50 rounded-md space-y-4">
                <h4 className="font-medium text-lg">Dividend Route Breakdown</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Corporation Tax</p>
                    <p className="font-semibold">{formatCurrency(result.corporationTax)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available for Dividend</p>
                    <p className="font-semibold">{formatCurrency(result.availableForDividend)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dividend Tax</p>
                    <p className="font-semibold">{formatCurrency(result.dividendTax)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tax</p>
                    <p className="font-semibold">{formatCurrency(result.totalDividendTax)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Take-Home Amount</p>
                    <p className="font-semibold text-lg">{formatCurrency(result.dividendTakeHome)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Effective Tax Rate</p>
                    <p className="font-semibold text-lg">{formatPercentage(result.dividendTaxRate)}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
