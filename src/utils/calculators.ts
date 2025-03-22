
// Common tax rates and thresholds for UK tax calculations (2023/2024 tax year)
export const TAX_RATES = {
  // Income Tax
  PERSONAL_ALLOWANCE: 12570,
  BASIC_RATE_THRESHOLD: 50270,
  HIGHER_RATE_THRESHOLD: 125140,
  BASIC_RATE: 0.20,
  HIGHER_RATE: 0.40,
  ADDITIONAL_RATE: 0.45,
  
  // National Insurance
  NI_PRIMARY_THRESHOLD: 12570,
  NI_UPPER_EARNINGS_LIMIT: 50270,
  NI_BASIC_RATE: 0.12,
  NI_HIGHER_RATE: 0.02,
  
  // Dividend Tax
  DIVIDEND_ALLOWANCE: 1000,
  DIVIDEND_BASIC_RATE: 0.0875,
  DIVIDEND_HIGHER_RATE: 0.3375,
  DIVIDEND_ADDITIONAL_RATE: 0.3935,
  
  // Corporation Tax
  CORPORATION_TAX_RATE: 0.25,
  SMALL_PROFITS_RATE: 0.19,
  SMALL_PROFITS_THRESHOLD: 50000,
  
  // Capital Gains Tax
  CGT_ALLOWANCE: 3000,
  CGT_BASIC_RATE: 0.10,
  CGT_HIGHER_RATE: 0.20,
  CGT_RESIDENTIAL_BASIC_RATE: 0.18,
  CGT_RESIDENTIAL_HIGHER_RATE: 0.28,
  
  // VAT
  VAT_STANDARD_RATE: 0.20,
  VAT_REDUCED_RATE: 0.05,
  VAT_ZERO_RATE: 0.00,
};

// Format currency with GBP symbol
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
};

// Self Assessment Tax Calculator
export const calculateSelfAssessmentTax = (
  income: number,
  expenses: number,
  pensionContributions: number
): {
  taxableIncome: number;
  personalAllowance: number;
  basicRateTax: number;
  higherRateTax: number;
  additionalRateTax: number;
  totalIncomeTax: number;
  nationalInsurance: number;
  totalTax: number;
  effectiveTaxRate: number;
  takeHome: number;
} => {
  const { 
    PERSONAL_ALLOWANCE, 
    BASIC_RATE_THRESHOLD, 
    HIGHER_RATE_THRESHOLD,
    BASIC_RATE,
    HIGHER_RATE,
    ADDITIONAL_RATE,
    NI_PRIMARY_THRESHOLD,
    NI_UPPER_EARNINGS_LIMIT,
    NI_BASIC_RATE,
    NI_HIGHER_RATE
  } = TAX_RATES;

  // Calculate taxable income
  const adjustedIncome = Math.max(0, income - expenses - pensionContributions);
  
  // Calculate personal allowance (reduces if income over £100,000)
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (adjustedIncome > 100000) {
    const reduction = Math.min(personalAllowance, (adjustedIncome - 100000) / 2);
    personalAllowance -= reduction;
  }
  
  // Calculate taxable income after personal allowance
  const taxableIncome = Math.max(0, adjustedIncome - personalAllowance);
  
  // Calculate Income Tax
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;
  
  // Basic rate (20%)
  if (taxableIncome > 0) {
    const basicRateBand = Math.min(taxableIncome, BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    basicRateTax = basicRateBand * BASIC_RATE;
  }
  
  // Higher rate (40%)
  if (taxableIncome > (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) {
    const higherRateBand = Math.min(
      taxableIncome - (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE),
      HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD
    );
    higherRateTax = higherRateBand * HIGHER_RATE;
  }
  
  // Additional rate (45%)
  if (taxableIncome > (HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) {
    const additionalRateBand = taxableIncome - (HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    additionalRateTax = additionalRateBand * ADDITIONAL_RATE;
  }
  
  // Total Income Tax
  const totalIncomeTax = basicRateTax + higherRateTax + additionalRateTax;
  
  // Calculate National Insurance (Class 4)
  let nationalInsurance = 0;
  const profitsForNI = Math.max(0, adjustedIncome);
  
  if (profitsForNI > NI_PRIMARY_THRESHOLD) {
    const basicRateNI = Math.min(
      profitsForNI - NI_PRIMARY_THRESHOLD,
      NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD
    ) * NI_BASIC_RATE;
    
    const higherRateNI = profitsForNI > NI_UPPER_EARNINGS_LIMIT
      ? (profitsForNI - NI_UPPER_EARNINGS_LIMIT) * NI_HIGHER_RATE
      : 0;
    
    nationalInsurance = basicRateNI + higherRateNI;
  }
  
  // Total Tax
  const totalTax = totalIncomeTax + nationalInsurance;
  
  // Effective Tax Rate
  const effectiveTaxRate = income > 0 ? totalTax / income : 0;
  
  // Take-home amount
  const takeHome = adjustedIncome - totalTax;
  
  return {
    taxableIncome,
    personalAllowance,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalIncomeTax,
    nationalInsurance,
    totalTax,
    effectiveTaxRate,
    takeHome
  };
};

// Corporation Tax Calculator
export const calculateCorporationTax = (
  profits: number,
  associatedCompanyCount: number = 0,
  accountingPeriodMonths: number = 12
): {
  taxableProfit: number;
  taxRate: number;
  corporationTax: number;
  profitAfterTax: number;
  effectiveTaxRate: number;
} => {
  const { CORPORATION_TAX_RATE, SMALL_PROFITS_RATE, SMALL_PROFITS_THRESHOLD } = TAX_RATES;
  
  // Adjust thresholds for short accounting periods and associated companies
  const adjustmentFactor = accountingPeriodMonths / 12;
  const companyCountFactor = associatedCompanyCount + 1;
  const adjustedSmallProfitsThreshold = 
    (SMALL_PROFITS_THRESHOLD * adjustmentFactor) / companyCountFactor;
  
  // Calculate marginal relief
  const marginalReliefFraction = (profits > adjustedSmallProfitsThreshold && profits < 250000)
    ? ((250000 - profits) / (250000 - adjustedSmallProfitsThreshold)) * 0.06
    : 0;
  
  // Determine tax rate
  let taxRate = CORPORATION_TAX_RATE;
  if (profits <= adjustedSmallProfitsThreshold) {
    taxRate = SMALL_PROFITS_RATE;
  } else if (profits < 250000) {
    taxRate = CORPORATION_TAX_RATE - marginalReliefFraction;
  }

  // Calculate tax
  const corporationTax = profits * taxRate;
  const profitAfterTax = profits - corporationTax;
  const effectiveTaxRate = profits > 0 ? corporationTax / profits : 0;
  
  return {
    taxableProfit: profits,
    taxRate,
    corporationTax,
    profitAfterTax,
    effectiveTaxRate
  };
};

// Dividend Tax Calculator
export const calculateDividendTax = (
  dividendAmount: number,
  otherIncome: number = 0
): {
  taxableDividends: number;
  basicRateTax: number;
  higherRateTax: number;
  additionalRateTax: number;
  totalDividendTax: number;
  effectiveTaxRate: number;
  netDividend: number;
} => {
  const {
    PERSONAL_ALLOWANCE,
    BASIC_RATE_THRESHOLD,
    HIGHER_RATE_THRESHOLD,
    DIVIDEND_ALLOWANCE,
    DIVIDEND_BASIC_RATE,
    DIVIDEND_HIGHER_RATE,
    DIVIDEND_ADDITIONAL_RATE
  } = TAX_RATES;
  
  // Calculate remaining allowances
  let remainingPersonalAllowance = Math.max(0, PERSONAL_ALLOWANCE - otherIncome);
  
  // Calculate remaining tax bands after other income
  let remainingBasicRateBand = Math.max(0, BASIC_RATE_THRESHOLD - Math.max(otherIncome, PERSONAL_ALLOWANCE));
  let remainingHigherRateBand = Math.max(0, HIGHER_RATE_THRESHOLD - Math.max(otherIncome, BASIC_RATE_THRESHOLD));
  
  // Apply dividend allowance (£1,000 for 2023/24)
  let taxableDividends = Math.max(0, dividendAmount - DIVIDEND_ALLOWANCE);
  
  // Apply personal allowance to dividends if available
  if (remainingPersonalAllowance > 0) {
    taxableDividends = Math.max(0, taxableDividends - remainingPersonalAllowance);
  }
  
  // Calculate tax at each band
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;
  
  // Basic rate band (8.75%)
  if (taxableDividends > 0 && remainingBasicRateBand > 0) {
    const inBasicBand = Math.min(taxableDividends, remainingBasicRateBand);
    basicRateTax = inBasicBand * DIVIDEND_BASIC_RATE;
    taxableDividends -= inBasicBand;
  }
  
  // Higher rate band (33.75%)
  if (taxableDividends > 0 && remainingHigherRateBand > 0) {
    const inHigherBand = Math.min(taxableDividends, remainingHigherRateBand);
    higherRateTax = inHigherBand * DIVIDEND_HIGHER_RATE;
    taxableDividends -= inHigherBand;
  }
  
  // Additional rate band (39.35%)
  if (taxableDividends > 0) {
    additionalRateTax = taxableDividends * DIVIDEND_ADDITIONAL_RATE;
  }
  
  // Total dividend tax
  const totalDividendTax = basicRateTax + higherRateTax + additionalRateTax;
  
  // Effective tax rate
  const effectiveTaxRate = dividendAmount > 0 ? totalDividendTax / dividendAmount : 0;
  
  // Net dividend after tax
  const netDividend = dividendAmount - totalDividendTax;
  
  return {
    taxableDividends: dividendAmount - DIVIDEND_ALLOWANCE,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalDividendTax,
    effectiveTaxRate,
    netDividend
  };
};

// Salary vs Dividend Calculator
export const calculateSalaryVsDividend = (
  companySalary: number,
  companyDividend: number,
  companyProfit: number
): {
  // Salary route
  salaryEmployerNI: number;
  salaryIncomeTax: number;
  salaryEmployeeNI: number;
  salaryTakeHome: number;
  totalSalaryTax: number;
  salaryTaxRate: number;
  
  // Dividend route
  corporationTax: number;
  availableForDividend: number;
  dividendTax: number;
  dividendTakeHome: number;
  totalDividendTax: number;
  dividendTaxRate: number;
  
  // Comparison
  difference: number;
  mostEfficient: 'salary' | 'dividend';
} => {
  const {
    PERSONAL_ALLOWANCE,
    BASIC_RATE_THRESHOLD,
    HIGHER_RATE_THRESHOLD,
    BASIC_RATE,
    HIGHER_RATE,
    ADDITIONAL_RATE,
    NI_PRIMARY_THRESHOLD,
    NI_UPPER_EARNINGS_LIMIT,
    NI_BASIC_RATE,
    NI_HIGHER_RATE,
    CORPORATION_TAX_RATE,
    DIVIDEND_ALLOWANCE,
    DIVIDEND_BASIC_RATE,
    DIVIDEND_HIGHER_RATE,
    DIVIDEND_ADDITIONAL_RATE
  } = TAX_RATES;
  
  // 1. Salary route calculations
  
  // Employer NI (13.8% above £9,100)
  const employerNIThreshold = 9100;
  const salaryEmployerNI = companySalary > employerNIThreshold 
    ? (companySalary - employerNIThreshold) * 0.138 
    : 0;
  
  // Income Tax on Salary
  let salaryTaxableAmount = Math.max(0, companySalary - PERSONAL_ALLOWANCE);
  let salaryIncomeTax = 0;
  
  if (salaryTaxableAmount > 0) {
    // Basic rate
    const basicRateAmount = Math.min(salaryTaxableAmount, BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    salaryIncomeTax += basicRateAmount * BASIC_RATE;
    
    // Higher rate
    if (salaryTaxableAmount > (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) {
      const higherRateAmount = Math.min(
        salaryTaxableAmount - (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE),
        HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD
      );
      salaryIncomeTax += higherRateAmount * HIGHER_RATE;
      
      // Additional rate
      if (salaryTaxableAmount > (HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) {
        const additionalRateAmount = salaryTaxableAmount - (HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
        salaryIncomeTax += additionalRateAmount * ADDITIONAL_RATE;
      }
    }
  }
  
  // Employee NI
  let salaryEmployeeNI = 0;
  if (companySalary > NI_PRIMARY_THRESHOLD) {
    const basicRateNI = Math.min(
      companySalary - NI_PRIMARY_THRESHOLD,
      NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD
    ) * NI_BASIC_RATE;
    
    const higherRateNI = companySalary > NI_UPPER_EARNINGS_LIMIT
      ? (companySalary - NI_UPPER_EARNINGS_LIMIT) * NI_HIGHER_RATE
      : 0;
    
    salaryEmployeeNI = basicRateNI + higherRateNI;
  }
  
  // Total salary take home
  const salaryTakeHome = companySalary - salaryIncomeTax - salaryEmployeeNI;
  
  // Total salary taxes (including employer NI)
  const totalSalaryTax = salaryEmployerNI + salaryIncomeTax + salaryEmployeeNI;
  
  // Effective salary tax rate
  const totalSalaryCost = companySalary + salaryEmployerNI;
  const salaryTaxRate = totalSalaryCost > 0 ? totalSalaryTax / totalSalaryCost : 0;
  
  // 2. Dividend route calculations
  
  // Corporation tax
  const corporationTax = companyProfit * CORPORATION_TAX_RATE;
  
  // Available for dividend
  const availableForDividend = companyProfit - corporationTax;
  
  // Dividend tax
  const dividendTaxResult = calculateDividendTax(companyDividend, 0);
  const dividendTax = dividendTaxResult.totalDividendTax;
  
  // Dividend take home
  const dividendTakeHome = companyDividend - dividendTax;
  
  // Total dividend taxes (corp tax + dividend tax)
  const totalDividendTax = corporationTax + dividendTax;
  
  // Effective dividend tax rate
  const dividendTaxRate = companyProfit > 0 ? totalDividendTax / companyProfit : 0;
  
  // 3. Comparison
  const difference = dividendTakeHome - salaryTakeHome;
  const mostEfficient = difference > 0 ? 'dividend' : 'salary';
  
  return {
    // Salary route
    salaryEmployerNI,
    salaryIncomeTax,
    salaryEmployeeNI,
    salaryTakeHome,
    totalSalaryTax,
    salaryTaxRate,
    
    // Dividend route
    corporationTax,
    availableForDividend,
    dividendTax,
    dividendTakeHome,
    totalDividendTax,
    dividendTaxRate,
    
    // Comparison
    difference,
    mostEfficient
  };
};

// Capital Gains Tax Calculator
export const calculateCapitalGainsTax = (
  acquisitionPrice: number,
  disposalPrice: number,
  acquisitionCosts: number,
  disposalCosts: number,
  annualIncome: number,
  isResidentialProperty: boolean
): {
  gain: number;
  taxableGain: number;
  basicRateCGT: number;
  higherRateCGT: number;
  totalCGT: number;
  effectiveCGTRate: number;
  netProceeds: number;
} => {
  const {
    PERSONAL_ALLOWANCE,
    BASIC_RATE_THRESHOLD,
    CGT_ALLOWANCE,
    CGT_BASIC_RATE,
    CGT_HIGHER_RATE,
    CGT_RESIDENTIAL_BASIC_RATE,
    CGT_RESIDENTIAL_HIGHER_RATE
  } = TAX_RATES;
  
  // Calculate total gain
  const gain = Math.max(0, disposalPrice - acquisitionPrice - acquisitionCosts - disposalCosts);
  
  // Apply annual CGT allowance
  const taxableGain = Math.max(0, gain - CGT_ALLOWANCE);
  
  if (taxableGain <= 0) {
    return {
      gain,
      taxableGain: 0,
      basicRateCGT: 0,
      higherRateCGT: 0,
      totalCGT: 0,
      effectiveCGTRate: 0,
      netProceeds: disposalPrice - disposalCosts
    };
  }
  
  // Determine tax rates based on asset type
  const basicRate = isResidentialProperty ? CGT_RESIDENTIAL_BASIC_RATE : CGT_BASIC_RATE;
  const higherRate = isResidentialProperty ? CGT_RESIDENTIAL_HIGHER_RATE : CGT_HIGHER_RATE;
  
  // Determine how much of the basic rate band is available
  const usedTaxBand = Math.max(0, annualIncome - PERSONAL_ALLOWANCE);
  const remainingBasicRateBand = Math.max(0, BASIC_RATE_THRESHOLD - usedTaxBand);
  
  // Calculate CGT at basic and higher rates
  let basicRateCGT = 0;
  let higherRateCGT = 0;
  
  if (remainingBasicRateBand > 0) {
    const gainAtBasicRate = Math.min(taxableGain, remainingBasicRateBand);
    basicRateCGT = gainAtBasicRate * basicRate;
    
    if (taxableGain > remainingBasicRateBand) {
      const gainAtHigherRate = taxableGain - remainingBasicRateBand;
      higherRateCGT = gainAtHigherRate * higherRate;
    }
  } else {
    // All gain taxed at higher rate
    higherRateCGT = taxableGain * higherRate;
  }
  
  // Total CGT
  const totalCGT = basicRateCGT + higherRateCGT;
  
  // Effective CGT rate
  const effectiveCGTRate = gain > 0 ? totalCGT / gain : 0;
  
  // Net proceeds
  const netProceeds = disposalPrice - disposalCosts - totalCGT;
  
  return {
    gain,
    taxableGain,
    basicRateCGT,
    higherRateCGT,
    totalCGT,
    effectiveCGTRate,
    netProceeds
  };
};

// VAT Calculator (already implemented in the component)
export const calculateVAT = (
  amount: number,
  vatRate: number,
  isInclusive: boolean
): {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
} => {
  if (isInclusive) {
    // Calculate from gross to net (VAT inclusive)
    const netAmount = amount / (1 + vatRate / 100);
    const vatAmount = amount - netAmount;
    return {
      netAmount,
      vatAmount,
      grossAmount: amount
    };
  } else {
    // Calculate from net to gross (VAT exclusive)
    const vatAmount = amount * (vatRate / 100);
    const grossAmount = amount + vatAmount;
    return {
      netAmount: amount,
      vatAmount,
      grossAmount
    };
  }
};
