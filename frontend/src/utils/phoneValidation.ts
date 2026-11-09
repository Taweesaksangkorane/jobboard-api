export function isValidThaiPhone(value: string): boolean {
  return /^0\d{9}$/.test(value.replace(/[\s-]/g, ''));
}

export const thaiPhoneHelp = '10 digits, for example 085-456-5589';
