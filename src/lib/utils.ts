import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CURRENCY } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function numberToWords(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  if (num === 0) return 'zero';

  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';

    let result = '';

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }

    if (n >= 10 && n <= 19) {
      result += teens[n - 10];
    } else {
      result += tens[Math.floor(n / 10)];
      if (tens[Math.floor(n / 10)] && ones[n % 10]) result += '-';
      result += ones[n % 10];
    }

    return result.trim();
  }

  let numToConvert = Math.floor(num);
  let result = '';

  if (numToConvert >= 1000) {
    result += convertLessThanThousand(Math.floor(numToConvert / 1000)) + ' thousand ';
    numToConvert = numToConvert % 1000;
  }

  result += convertLessThanThousand(numToConvert);

  // Handle decimal part
  const decimal = Math.round((num - Math.floor(num)) * 100);
  if (decimal > 0) {
    result += ' and ' + convertLessThanThousand(decimal) + ' paise';
  }

  return result.trim();
}
