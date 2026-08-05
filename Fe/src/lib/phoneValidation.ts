/**
 * Country-based Phone Number Validation Helper
 * Validates subscriber phone numbers based on international standards (E.164)
 * and specific country code rules.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePhoneByCountry(phone: string, countryCode: string = '+91'): PhoneValidationResult {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { isValid: false, message: 'Phone number is required.' };
  }

  const digitsOnly = phone.replace(/\D/g, '');

  if (!digitsOnly) {
    return { isValid: false, message: 'Please enter digits only.' };
  }

  switch (countryCode) {
    case '+91': // India
      if (digitsOnly.length !== 10) {
        return { isValid: false, message: 'India (+91) phone number must be exactly 10 digits.' };
      }
      if (!/^[6-9]/.test(digitsOnly)) {
        return { isValid: false, message: 'India (+91) phone numbers must start with 6, 7, 8, or 9.' };
      }
      break;

    case '+1': // USA / Canada
      if (digitsOnly.length !== 10) {
        return { isValid: false, message: 'USA/Canada (+1) phone number must be exactly 10 digits.' };
      }
      break;

    case '+44': // UK
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        return { isValid: false, message: 'UK (+44) phone number must be 10 or 11 digits.' };
      }
      break;

    case '+971': // UAE
      if (digitsOnly.length !== 9) {
        return { isValid: false, message: 'UAE (+971) phone number must be exactly 9 digits.' };
      }
      break;

    case '+65': // Singapore
      if (digitsOnly.length !== 8) {
        return { isValid: false, message: 'Singapore (+65) phone number must be exactly 8 digits.' };
      }
      break;

    case '+61': // Australia
      if (digitsOnly.length !== 9) {
        return { isValid: false, message: 'Australia (+61) phone number must be exactly 9 digits.' };
      }
      break;

    case '+966': // Saudi Arabia
      if (digitsOnly.length !== 9) {
        return { isValid: false, message: 'Saudi Arabia (+966) phone number must be exactly 9 digits.' };
      }
      break;

    case '+974': // Qatar
      if (digitsOnly.length !== 8) {
        return { isValid: false, message: 'Qatar (+974) phone number must be exactly 8 digits.' };
      }
      break;

    case '+968': // Oman
      if (digitsOnly.length !== 8) {
        return { isValid: false, message: 'Oman (+968) phone number must be exactly 8 digits.' };
      }
      break;

    case '+965': // Kuwait
      if (digitsOnly.length !== 8) {
        return { isValid: false, message: 'Kuwait (+965) phone number must be exactly 8 digits.' };
      }
      break;

    case '+973': // Bahrain
      if (digitsOnly.length !== 8) {
        return { isValid: false, message: 'Bahrain (+973) phone number must be exactly 8 digits.' };
      }
      break;

    case '+60': // Malaysia
      if (digitsOnly.length < 9 || digitsOnly.length > 10) {
        return { isValid: false, message: 'Malaysia (+60) phone number must be 9 or 10 digits.' };
      }
      break;

    case '+66': // Thailand
      if (digitsOnly.length !== 9) {
        return { isValid: false, message: 'Thailand (+66) phone number must be exactly 9 digits.' };
      }
      break;

    case '+49': // Germany
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        return { isValid: false, message: 'Germany (+49) phone number must be 10 or 11 digits.' };
      }
      break;

    case '+33': // France
      if (digitsOnly.length !== 9) {
        return { isValid: false, message: 'France (+33) phone number must be exactly 9 digits.' };
      }
      break;

    default:
      if (digitsOnly.length < 6 || digitsOnly.length > 15) {
        return { isValid: false, message: 'Please enter a valid phone number (6 to 15 digits).' };
      }
      break;
  }

  return { isValid: true };
}

export function isValidPhone(phone: string, countryCode: string = '+91'): boolean {
  return validatePhoneByCountry(phone, countryCode).isValid;
}
