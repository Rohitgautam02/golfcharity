export const welcomeEmail = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; color: #1c1c1e; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f7f3ed; }
    .header { text-align: center; padding-bottom: 20px; }
    .btn { background: #1a5c38; color: #ffffff; padding: 12px 24px; border-radius: 99px; text-decoration: none; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⛳ GolfGives</h1>
    </div>
    <p>Hi ${name},</p>
    <p>Welcome to GolfGives! We're thrilled to have you join our community where your golf scores turn into positive impact.</p>
    <p>Getting started is easy:</p>
    <ol>
      <li>Log in to your dashboard</li>
      <li>Pick a charity you'd like to support</li>
      <li>Enter your recent golf scores (1-45)</li>
    </ol>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Enter Your First Score</a>
    </div>
    <p>Good luck in this month's draw!</p>
    <p>Best,<br/>The GolfGives Team</p>
  </div>
</body>
</html>
`

export const drawResultEmail = (name, matchCount, prizeAmount) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; color: #1c1c1e; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f7f3ed; border: 1px solid #1a5c38; }
    .prize { font-size: 24px; color: #c9a84c; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h2>This Month's Draw Results</h2>
    <p>Hi ${name},</p>
    <p>The numbers are in! You matched <strong>${matchCount}</strong> numbers this month.</p>
    ${prizeAmount > 0 
      ? `<p class="prize">🏆 You won £${prizeAmount}!</p>
         <p>Please log in to your dashboard to verify your winning scores and claim your prize.</p>`
      : `<p>No luck this time, but your participation helped raise vital funds for your selected charity this month. Thank you for making a difference!</p>`
    }
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/draws" style="background: #1a5c38; color: white; padding: 12px 24px; border-radius: 99px; text-decoration: none;">View Draw Details</a>
    </div>
    <p>See you next month!</p>
  </div>
</body>
</html>
`

export const winnerApprovedEmail = (name, amount) => `
<p>Hi ${name},</p>
<p>Great news! Your prize claim for <strong>£${amount}</strong> has been approved.</p>
<p>Our team is now processing the payment. You should see the funds in your account within 3-5 business days via your linked payment method.</p>
<p>Congratulations once again!</p>
`

export const subscriptionCancelledEmail = (name) => `
<p>Hi ${name},</p>
<p>Your GolfGives subscription has been successfully cancelled. You'll still be entered into the current month's draw if you had an active subscription during the entry period.</p>
<p>We're sorry to see you go! If you ever want to rejoin and continue supporting meaningful charities, we'll be here for you.</p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe">Rejoin now</a></p>
`
