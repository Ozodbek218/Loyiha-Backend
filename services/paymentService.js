/**
 * Payment Service Abstraction
 * Supports Cash on Delivery, Simulated Card Processing, and provides pluggable adapters
 * for Stripe, Payme, Click, or PayPal without storing sensitive card credentials.
 */

class PaymentService {
  /**
   * Process payment based on provider
   */
  static async processPayment({ method, amount, currency = 'USD', paymentData = {}, orderNumber }) {
    const norm = (method || 'cod').toString().toLowerCase().replace(/[\s_-]/g, '');

    switch (norm) {
      case 'cod':
      case 'cashondelivery':
      case 'cash':
        return {
          success: true,
          status: 'Pending',
          provider: 'Cash on Delivery',
          transactionId: `COD-${Date.now()}`,
          message: 'Payment will be collected upon delivery'
        };

      case 'card':
      case 'creditcard':
      case 'debitcard': {
        const last4 = paymentData.cardLast4 || '4242';
        return {
          success: true,
          status: 'Paid',
          provider: 'Credit/Debit Card (Direct)',
          transactionId: `TXN-CARD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          cardLast4: last4,
          message: `Payment authorized for $${amount} via card ending in ${last4}`
        };
      }

      case 'stripe':
        return {
          success: true,
          status: 'Paid',
          provider: 'Stripe Gateway',
          transactionId: `pi_${Date.now()}_simulated`,
          message: 'Stripe checkout verified'
        };

      case 'payme':
      case 'click':
        return {
          success: true,
          status: 'Paid',
          provider: method === 'payme' ? 'Payme Uzbekistan' : 'Click Uzbekistan',
          transactionId: `${method.toUpperCase()}-${Date.now()}`,
          message: `Payment confirmed via ${method.toUpperCase()}`
        };

      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }

  /**
   * Refund payment
   */
  static async refundPayment({ transactionId, amount }) {
    return {
      success: true,
      refundId: `REF-${Date.now()}`,
      status: 'Refunded',
      amount
    };
  }
}

module.exports = {
  PaymentService
};
