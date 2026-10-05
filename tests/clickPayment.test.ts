import assert from 'node:assert/strict';
import { PaymentSubscriptionRepository } from '../src/server/paymentRepository';
import {
  ClickEnvConfig,
  computeClickSignature,
} from '../src/server/clickPaymentProvider';
import { PaymentOrchestratorService } from '../src/server/paymentOrchestrator';

const TEST_CONFIG: ClickEnvConfig = {
  serviceId: '12345',
  merchantId: '67890',
  merchantUserId: '111',
  secretKey: 'test_super_secret_click_key_do_not_expose',
  testMode: true,
};

function createTestSuite() {
  const repo = new PaymentSubscriptionRepository();
  const orchestrator = new PaymentOrchestratorService(repo, TEST_CONFIG);
  return { repo, orchestrator };
}

async function runTests() {
  console.log('=== Running Click Merchant Payment & Subscription Integration Tests ===\n');

  // ---------------------------------------------------------------------------
  // 1. 19 000 UZS monthly payment + 10. Payment success -> PRO activation
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_monthly_1',
      email: 'monthly@smartdownload.uz',
      plan: 'PRO_MONTHLY',
      amount: 500, // Untrusted client amount -> Server MUST enforce 19000 UZS
    });

    assert.equal(session.payment.amount, 19000, 'Server must override untrusted client amount with 19000 UZS');
    assert.equal(session.payment.status, 'PENDING');
    assert.ok(session.paymentUrl?.includes('amount=19000.00'));

    const signTime = '2026-10-05 12:00:00';
    const prepareSign = computeClickSignature({
      clickTransId: '9001',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: '19000',
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9001',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: '19000',
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepareSign,
    });

    assert.equal(prepRes.error, 0, 'Prepare must succeed for valid 19 000 UZS request');
    assert.ok(prepRes.merchant_prepare_id);

    const completeSign = computeClickSignature({
      clickTransId: '9001',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      merchantPrepareId: prepRes.merchant_prepare_id,
      amount: '19000',
      action: 1,
      signTime,
    });

    const compRes = orchestrator.handleClickComplete({
      click_trans_id: '9001',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes.merchant_prepare_id,
      amount: '19000',
      action: 1,
      error: 0,
      sign_time: signTime,
      sign_string: completeSign,
    });

    assert.equal(compRes.error, 0, 'Complete must succeed');
    const updatedPayment = repo.getPaymentById(session.payment.id)!;
    const updatedUser = repo.getUserById('usr_monthly_1')!;

    assert.equal(updatedPayment.status, 'PAID');
    assert.equal(updatedUser.plan, 'PRO_MONTHLY');
    assert.equal(updatedUser.subscriptionStatus, 'ACTIVE');

    const startMs = new Date(updatedUser.subscriptionStart!).getTime();
    const endMs = new Date(updatedUser.subscriptionEnd!).getTime();
    const daysDiff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    assert.ok(daysDiff >= 28 && daysDiff <= 31, 'Monthly subscriptionEnd must be ~1 month from start');
    console.log('✓ Test 1 & 10 Passed: 19 000 UZS monthly payment & PRO_MONTHLY activation (+1 month)');
  }

  // ---------------------------------------------------------------------------
  // 2. 149 000 UZS yearly payment
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_yearly_1',
      email: 'yearly@smartdownload.uz',
      plan: 'PRO_YEARLY',
    });

    assert.equal(session.payment.amount, 149000);
    const signTime = '2026-10-05 12:05:00';

    const prepSign = computeClickSignature({
      clickTransId: '9002',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: 149000,
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9002',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: 149000,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });
    assert.equal(prepRes.error, 0);

    const compSign = computeClickSignature({
      clickTransId: '9002',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      merchantPrepareId: prepRes.merchant_prepare_id,
      amount: 149000,
      action: 1,
      signTime,
    });

    const compRes = orchestrator.handleClickComplete({
      click_trans_id: '9002',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes.merchant_prepare_id,
      amount: 149000,
      action: 1,
      error: 0,
      sign_time: signTime,
      sign_string: compSign,
    });

    assert.equal(compRes.error, 0);
    const updatedUser = repo.getUserById('usr_yearly_1')!;
    assert.equal(updatedUser.plan, 'PRO_YEARLY');
    assert.equal(updatedUser.subscriptionStatus, 'ACTIVE');

    const startMs = new Date(updatedUser.subscriptionStart!).getTime();
    const endMs = new Date(updatedUser.subscriptionEnd!).getTime();
    const daysDiff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    assert.ok(daysDiff >= 365 && daysDiff <= 366, 'Yearly subscriptionEnd must be 1 year from start');
    console.log('✓ Test 2 Passed: 149 000 UZS yearly payment & PRO_YEARLY activation (+1 year)');
  }

  // ---------------------------------------------------------------------------
  // 3. Wrong amount
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_wrong_amt',
      email: 'wrong@smartdownload.uz',
      plan: 'PRO_MONTHLY',
    });

    const signTime = '2026-10-05 12:10:00';
    const wrongAmount = 1000; // Expected 19000
    const prepSign = computeClickSignature({
      clickTransId: '9003',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: wrongAmount,
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9003',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: wrongAmount,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });

    assert.equal(prepRes.error, -2, 'Must reject wrong amount with Click error -2');
    assert.equal(repo.getUserById('usr_wrong_amt')!.plan, 'FREE');
    console.log('✓ Test 3 Passed: Wrong amount rejected with Click error -2');
  }

  // ---------------------------------------------------------------------------
  // 4. Failed payment & 11. Payment failure -> PRO remains FREE
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_failed',
      email: 'failed@smartdownload.uz',
      plan: 'PRO_MONTHLY',
    });

    const signTime = '2026-10-05 12:15:00';
    const prepSign = computeClickSignature({
      clickTransId: '9004',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: 19000,
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9004',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: 19000,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });

    const compSign = computeClickSignature({
      clickTransId: '9004',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      merchantPrepareId: prepRes.merchant_prepare_id,
      amount: 19000,
      action: 1,
      signTime,
    });

    const compRes = orchestrator.handleClickComplete({
      click_trans_id: '9004',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes.merchant_prepare_id,
      amount: 19000,
      action: 1,
      error: -5017, // Insufficient funds / failed error from Click
      error_note: 'Insufficient funds',
      sign_time: signTime,
      sign_string: compSign,
    });

    assert.equal(compRes.error, -9);
    assert.equal(repo.getPaymentById(session.payment.id)!.status, 'FAILED');
    assert.equal(repo.getUserById('usr_failed')!.plan, 'FREE');
    console.log('✓ Test 4 & 11 Passed: Failed payment sets status=FAILED and user remains FREE');
  }

  // ---------------------------------------------------------------------------
  // 5. Cancelled payment
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_cancelled',
      email: 'cancel@smartdownload.uz',
      plan: 'PRO_YEARLY',
    });

    const signTime = '2026-10-05 12:20:00';
    const prepSign = computeClickSignature({
      clickTransId: '9005',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: 149000,
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9005',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: 149000,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });

    const compSign = computeClickSignature({
      clickTransId: '9005',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      merchantPrepareId: prepRes.merchant_prepare_id,
      amount: 149000,
      action: 1,
      signTime,
    });

    const compRes = orchestrator.handleClickComplete({
      click_trans_id: '9005',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes.merchant_prepare_id,
      amount: 149000,
      action: 1,
      error: -9, // Cancelled
      error_note: 'Transaction cancelled by user',
      sign_time: signTime,
      sign_string: compSign,
    });

    assert.equal(compRes.error, -9);
    assert.equal(repo.getPaymentById(session.payment.id)!.status, 'CANCELLED');
    assert.equal(repo.getUserById('usr_cancelled')!.plan, 'FREE');
    console.log('✓ Test 5 Passed: Cancelled payment sets status=CANCELLED and user remains FREE');
  }

  // ---------------------------------------------------------------------------
  // 6. Duplicate callback & 7. Same transaction callback twice (Idempotency)
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const session = orchestrator.createClickPayment({
      userId: 'usr_idempotent',
      email: 'idem@smartdownload.uz',
      plan: 'PRO_MONTHLY',
    });

    const signTime = '2026-10-05 12:25:00';
    const prepSign = computeClickSignature({
      clickTransId: '9006',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      amount: 19000,
      action: 0,
      signTime,
    });

    const prepRes1 = orchestrator.handleClickPrepare({
      click_trans_id: '9006',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      amount: 19000,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });

    const compSign = computeClickSignature({
      clickTransId: '9006',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: session.payment.id,
      merchantPrepareId: prepRes1.merchant_prepare_id,
      amount: 19000,
      action: 1,
      signTime,
    });

    // First complete -> Success (0)
    const compRes1 = orchestrator.handleClickComplete({
      click_trans_id: '9006',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes1.merchant_prepare_id,
      amount: 19000,
      action: 1,
      error: 0,
      sign_time: signTime,
      sign_string: compSign,
    });
    assert.equal(compRes1.error, 0);
    const firstEnd = repo.getUserById('usr_idempotent')!.subscriptionEnd;

    // Second complete with same transaction -> Must return ALREADY_PAID (-4) and NOT double-extend subscription
    const compRes2 = orchestrator.handleClickComplete({
      click_trans_id: '9006',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: session.payment.id,
      merchant_prepare_id: prepRes1.merchant_prepare_id,
      amount: 19000,
      action: 1,
      error: 0,
      sign_time: signTime,
      sign_string: compSign,
    });
    assert.equal(compRes2.error, -4, 'Second complete callback must return Click error -4 (Already paid)');
    assert.equal(
      repo.getUserById('usr_idempotent')!.subscriptionEnd,
      firstEnd,
      'Idempotency: Subscription end date must not be extended twice'
    );
    console.log('✓ Test 6 & 7 Passed: Duplicate / repeated transaction callbacks handled idempotently (-4 Already Paid)');
  }

  // ---------------------------------------------------------------------------
  // 8. Expired payment
  // ---------------------------------------------------------------------------
  {
    const { repo, orchestrator } = createTestSuite();
    const pastDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const expiredPayment = repo.createPayment({
      id: 'pay_expired_test',
      userId: 'usr_exp',
      email: 'exp@smartdownload.uz',
      provider: 'CLICK',
      plan: 'PRO_MONTHLY',
      amount: 19000,
      currency: 'UZS',
      status: 'PENDING',
      providerTransactionId: null,
      createdAt: pastDate,
      paidAt: null,
      expiresAt: pastDate, // Already expired
      metadata: {},
    });

    const signTime = '2026-10-05 12:30:00';
    const prepSign = computeClickSignature({
      clickTransId: '9008',
      serviceId: TEST_CONFIG.serviceId,
      secretKey: TEST_CONFIG.secretKey,
      merchantTransId: expiredPayment.id,
      amount: 19000,
      action: 0,
      signTime,
    });

    const prepRes = orchestrator.handleClickPrepare({
      click_trans_id: '9008',
      service_id: TEST_CONFIG.serviceId,
      merchant_trans_id: expiredPayment.id,
      amount: 19000,
      action: 0,
      error: 0,
      sign_time: signTime,
      sign_string: prepSign,
    });

    assert.equal(prepRes.error, -5, 'Expired payment must not be prepared');
    assert.equal(repo.getPaymentById(expiredPayment.id)!.status, 'EXPIRED');
    console.log('✓ Test 8 Passed: Expired payment automatically transitions to EXPIRED and rejects webhook');
  }

  // ---------------------------------------------------------------------------
  // 9. Unauthenticated user
  // ---------------------------------------------------------------------------
  {
    const { orchestrator } = createTestSuite();
    assert.throws(
      () => {
        orchestrator.createClickPayment({
          userId: '',
          email: '',
          plan: 'PRO_MONTHLY',
        });
      },
      /UNAUTHENTICATED/,
      'Unauthenticated user must be rejected when creating payment'
    );
    console.log('✓ Test 9 Passed: Unauthenticated user rejected with UNAUTHENTICATED error');
  }

  console.log('\n=== All 11 Click Merchant Integration & Subscription Security Tests Passed! ===');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
