import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';
import { getPayUConfig, verifyPayUResponseHash } from '@/lib/payu';

/**
 * PayU Callback Handler (surl / furl)
 *
 * PayU POSTs form-urlencoded data to this endpoint after the user
 * completes or cancels payment on PayU's hosted checkout page.
 *
 * Flow:
 * 1. Parse the form-urlencoded body
 * 2. Verify the SHA-512 response hash to ensure data integrity
 * 3. Update the order's payment status in the data store
 * 4. Redirect the user to /order-success or /payment-failed
 */
export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

  try {
    let data: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // PayU sends application/x-www-form-urlencoded from their hosted page
      const formText = await req.text();
      const params = new URLSearchParams(formText);
      params.forEach((value, key) => {
        data[key] = value;
      });
    } else if (contentType.includes('multipart/form-data')) {
      // Fallback: some PayU integrations may use multipart
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
    } else if (contentType.includes('application/json')) {
      // JSON fallback for internal testing/simulation
      data = await req.json();
    } else {
      // Try parsing as form-urlencoded by default (PayU standard)
      const formText = await req.text();
      const params = new URLSearchParams(formText);
      params.forEach((value, key) => {
        data[key] = value;
      });
    }

    const {
      txnid,
      status,
      mihpayid = '',
      mode = 'UPI',
      hash,
    } = data;

    if (!txnid) {
      return NextResponse.redirect(`${appUrl}/payment-failed?error=missing_txnid`, 303);
    }

    // ── Hash Verification ────────────────────────────────────────────
    // PayU always sends a hash in the response. Verify it to ensure
    // the response hasn't been tampered with.
    const payuConfig = getPayUConfig();
    let hashValid = false;

    if (hash) {
      hashValid = verifyPayUResponseHash(data, payuConfig.salt);
    }

    // In production, reject if hash is missing or invalid.
    // In test mode, we allow missing hash for sandbox compatibility,
    // but still reject invalid hashes.
    const isTestMode = payuConfig.env === 'test';

    if (!hash && !isTestMode) {
      console.error(`[PayU Callback] Missing hash for txnid: ${txnid}`);
      return NextResponse.redirect(
        `${appUrl}/payment-failed?txnid=${txnid}&error=missing_hash`,
        303
      );
    }

    if (hash && !hashValid) {
      console.error(`[PayU Callback] Hash verification FAILED for txnid: ${txnid}`);
      return NextResponse.redirect(
        `${appUrl}/payment-failed?txnid=${txnid}&error=hash_mismatch`,
        303
      );
    }

    // ── Update Order Status ──────────────────────────────────────────
    const isSuccess = status?.toLowerCase() === 'success';
    const paymentStatus = isSuccess ? 'PAID' : 'FAILED';

    const updatedOrder = dataStore.updatePayUTransaction(
      txnid,    // orderNumber or payuTxnId lookup
      txnid,
      mihpayid,
      paymentStatus as 'PAID' | 'FAILED',
      mode
    );

    if (isSuccess && updatedOrder) {
      console.log(`[PayU Callback] Payment SUCCESS for ${updatedOrder.orderNumber} (txnid: ${txnid})`);
      return NextResponse.redirect(
        `${appUrl}/order-success/${updatedOrder.orderNumber}`,
        303
      );
    } else if (updatedOrder) {
      console.log(`[PayU Callback] Payment FAILED for ${updatedOrder.orderNumber} (txnid: ${txnid}, status: ${status})`);
      return NextResponse.redirect(
        `${appUrl}/payment-failed?txnid=${txnid}&order=${updatedOrder.orderNumber}&status=${status || 'unknown'}`,
        303
      );
    } else {
      // Order not found in data store
      console.error(`[PayU Callback] Order not found for txnid: ${txnid}`);
      return NextResponse.redirect(
        `${appUrl}/payment-failed?txnid=${txnid}&error=order_not_found`,
        303
      );
    }
  } catch (error: any) {
    console.error('[PayU Callback] Error:', error);
    return NextResponse.redirect(
      `${appUrl}/payment-failed?error=server_error`,
      303
    );
  }
}
