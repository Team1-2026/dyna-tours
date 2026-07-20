<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout | Dyna Tours</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --success: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .checkout-container {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            width: 100%;
            max-width: 480px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: var(--text-muted);
            font-size: 15px;
            font-weight: 300;
        }

        .order-summary {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 15px;
        }

        .summary-item.total {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 0;
            color: #fff;
        }

        .pay-btn {
            width: 100%;
            background: var(--accent);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
        }

        .pay-btn:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.23);
        }

        .pay-btn:active {
            transform: translateY(0);
        }

        .success-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            font-size: 40px;
            margin: 0 auto 24px auto;
        }

        .success-text {
            text-align: center;
            color: var(--text-muted);
            line-height: 1.6;
        }
    </style>
</head>
<body>

    <div class="checkout-container">
        <div class="header">
            <div class="logo">Dyna Tours</div>
            <div class="subtitle">Premium Travel Experiences</div>
        </div>

        @if($payment->status === 'paid')
            <div class="success-icon">✓</div>
            <h2 style="text-align: center; margin-bottom: 16px;">Payment Successful!</h2>
            <p class="success-text">
                Your payment of <strong>${{ number_format($payment->amount, 2) }}</strong> has been securely processed.
                <br><br>
                You may now close this window and return to the chat to confirm your booking!
            </p>
        @else
            <div class="order-summary">
                <div class="summary-item">
                    <span style="color: var(--text-muted)">Package</span>
                    <span style="font-weight: 500; text-align: right; max-width: 60%;">{{ $payment->description }}</span>
                </div>
                <div class="summary-item">
                    <span style="color: var(--text-muted)">Taxes & Fees</span>
                    <span>Included</span>
                </div>
                <div class="summary-item total">
                    <span>Total Due</span>
                    <span>${{ number_format($payment->amount, 2) }} USD</span>
                </div>
            </div>

            <form method="POST" action="/pay/{{ $payment->id }}/process">
                @csrf
                <button type="submit" class="pay-btn">Pay ${{ number_format($payment->amount, 2) }} Now</button>
            </form>
            <p style="text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-muted);">
                🔒 Secure 256-bit SSL encrypted payment.
            </p>
        @endif
    </div>

</body>
</html>
