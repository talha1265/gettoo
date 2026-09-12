import crypto from 'crypto';

export interface PayUConfig {
  key: string;
  salt: string;
  env: 'test' | 'production';
}

export function getPayUConfig(): PayUConfig {
  return {
    key: process.env.PAYU_MERCHANT_KEY || 'gtKFFx',
    salt: process.env.PAYU_MERCHANT_SALT || 'eCwWELxi',
    env: (process.env.PAYU_ENV as 'test' | 'production') || 'test',
  };
}

export function getPayUUrl(env?: 'test' | 'production'): string {
  const currentEnv = env || process.env.PAYU_ENV || 'test';
  return currentEnv === 'production'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment';
}

/**
 * Calculates PayU payment request hash (SHA-512):
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export function generatePayUHash(params: {
  key: string;
  txnid: string;
  amount: string | number;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const formattedAmount = typeof params.amount === 'number' 
    ? params.amount.toFixed(2) 
    : parseFloat(params.amount).toFixed(2);

  const hashString = [
    params.key,
    params.txnid,
    formattedAmount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || '',
    params.udf2 || '',
    params.udf3 || '',
    params.udf4 || '',
    params.udf5 || '',
    '', // udf6
    '', // udf7
    '', // udf8
    '', // udf9
    '', // udf10
    params.salt,
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verifies PayU return callback response hash:
 * Normal response:
 * sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 *
 * If additionalCharges are present:
 * sha512(additionalCharges|salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  response: Record<string, string>,
  salt: string
): boolean {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash,
    additionalCharges,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
  } = response;

  if (!hash) return false;

  let hashSequence = [
    salt,
    status,
    '', // udf10
    '', // udf9
    '', // udf8
    '', // udf7
    '', // udf6
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ];

  if (additionalCharges) {
    hashSequence = [additionalCharges, ...hashSequence];
  }

  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashSequence.join('|'))
    .digest('hex');

  return calculatedHash.toLowerCase() === hash.toLowerCase();
}
