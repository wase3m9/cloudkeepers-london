
import { useState } from 'react';
import { calculateVAT, formatCurrency } from '@/utils/calculators';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { Pound, Percent } from 'lucide-react';

interface VATForm {
  amount: number;
  vatRate: number;
  calculationMode: 'exclusive' | 'inclusive';
}

export function VATCalculator() {
  const [result, setResult] = useState<{
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
  } | null>(null);

  const form = useForm<VATForm>({
    defaultValues: {
      amount: 0,
      vatRate: 20,
      calculationMode: 'exclusive',
    },
  });

  const onSubmit = (data: VATForm) => {
    const { amount, vatRate, calculationMode } = data;
    const calculationResult = calculateVAT(
      amount, 
      vatRate, 
      calculationMode === 'inclusive'
    );
    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">VAT Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="calculationMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Calculation Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exclusive" id="exclusive" />
                        <label htmlFor="exclusive" className="text-sm font-medium leading-none cursor-pointer">
                          Add VAT (exclusive to inclusive)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inclusive" id="inclusive" />
                        <label htmlFor="inclusive" className="text-sm font-medium leading-none cursor-pointer">
                          Remove VAT (inclusive to exclusive)
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vatRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Rate (%)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VAT rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="20">Standard Rate (20%)</SelectItem>
                      <SelectItem value="5">Reduced Rate (5%)</SelectItem>
                      <SelectItem value="0">Zero Rate (0%)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("calculationMode") === "exclusive" 
                      ? "Net Amount (excluding VAT)" 
                      : "Gross Amount (including VAT)"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Pound className="h-4 w-4" />
                      </span>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        className="pl-9"
                        step="0.01"
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
              Calculate
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Results</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Net Amount (excl. VAT)</p>
                <p className="font-semibold">{formatCurrency(result.netAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  VAT Amount ({form.watch("vatRate")}%)
                </p>
                <p className="font-semibold">{formatCurrency(result.vatAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gross Amount (incl. VAT)</p>
                <p className="font-semibold">{formatCurrency(result.grossAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
