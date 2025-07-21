export function createWelcomeEmailTemplate(userEmail, userName, verificationToken) {
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS}` 
    : process.env.BASE_URL || 'http://localhost:5000';

  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to JournOwl!</title>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap');
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', Arial, sans-serif;
        color: #1e293b;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #fff;
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 18px 40px rgba(0,0,0,0.12);
        animation: fadeIn 1s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px);}
        to { opacity: 1; transform: none;}
      }
      .header {
        padding: 48px 20px 24px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        text-align: center;
        border-bottom: 6px solid #a78bfa;
        position: relative;
      }
      .owl {
        font-size: 70px;
        margin-bottom: 10px;
        display: inline-block;
        animation: owlBounce 2.2s infinite;
      }
      @keyframes owlBounce {
        0%, 100% { transform: translateY(0);}
        15% { transform: translateY(-12px);}
        30% { transform: translateY(0);}
        45% { transform: translateY(-8px);}
        60% { transform: translateY(0);}
      }
      h1 {
        margin: 0 0 6px 0;
        font-size: 2.1em;
        font-weight: 700;
        letter-spacing: -1px;
      }
      .subhead {
        font-size: 18px;
        font-weight: 400;
        opacity: 0.92;
        margin-bottom: 0;
      }
      .content {
        padding: 36px 32px;
      }
      .verify-btn {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #a855f7 100%);
        color: #fff;
        font-size: 17px;
        font-weight: bold;
        border-radius: 50px;
        padding: 15px 34px;
        text-decoration: none;
        margin: 32px 0 22px 0;
        box-shadow: 0 8px 20px rgba(102,126,234,0.20);
        letter-spacing: 0.03em;
        transition: transform 0.22s cubic-bezier(.46,.03,.52,.96), box-shadow 0.22s;
        animation: pulseGlow 2s infinite;
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 8px 20px rgba(102,126,234,0.20);}
        50% { box-shadow: 0 8px 40px 8px #a78bfa33;}
      }
      .feature-list {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin: 34px 0 22px 0;
        justify-content: center;
      }
      .feature-card {
        flex: 1 1 210px;
        min-width: 170px;
        background: linear-gradient(120deg,#f3e8ff 60%, #e0f2fe 100%);
        border-radius: 14px;
        text-align: center;
        padding: 18px 12px;
        box-shadow: 0 3px 10px rgba(174,198,255,0.07);
        font-size: 15px;
        transition: transform .16s;
      }
      .feature-card span {
        font-size: 32px;
        display: block;
        margin-bottom: 7px;
      }
      .plan-block {
        background: linear-gradient(90deg, #fdf2f8 60%, #e0f2fe 100%);
        padding: 20px 16px 10px 16px;
        border-radius: 13px;
        margin: 30px 0 0 0;
        border-left: 5px solid #a78bfa;
        font-size: 15px;
      }
      .tips-block {
        background: linear-gradient(120deg,#fef3c7 40%,#fde68a 100%);
        padding: 14px 18px;
        border-radius: 12px;
        margin: 22px 0;
        color: #9a580c;
        border-left: 4px solid #f59e0b;
        font-size: 15px;
      }
      .footer {
        background: #f8fafc;
        padding: 28px 16px;
        text-align: center;
        color: #64748b;
        border-top: 1px solid #f1f5f9;
        font-size: 13px;
      }
      .links a { color: #8b5cf6; text-decoration: none; margin: 0 8px; }
      @media (max-width: 600px) {
        .container, .content { padding: 16px; }
        .feature-list { flex-direction: column; gap: 12px;}
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="owl">🦉</div>
        <h1>Welcome to JournOwl</h1>
        <p class="subhead">Your Wise Writing Companion</p>
      </div>
      <div class="content">
        <h2 style="margin: 0 0 16px 0; font-size: 1.3em; color: #3b3762;">Hi ${userName}! 👋</h2>
        <p>We're absolutely thrilled to have you join our mindful community of writers and dreamers.<br>JournOwl is where your story gets the wise sidekick it deserves!</p>
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="verify-btn">✅ Verify Email & Start Your Journey</a>
        </div>
        <h3 style="margin: 32px 0 10px 0; text-align: center; color: #5b21b6;">Why you'll ❤️ JournOwl:</h3>
        <div class="feature-list">
          <div class="feature-card">
            <span>🎨</span>
            <b>Smart Editor</b><br>
            Beautiful fonts, themes & creative prompts
          </div>
          <div class="feature-card">
            <span>📸</span>
            <b>Photo AI</b><br>
            Instant insights & inspiration from your images
          </div>
          <div class="feature-card">
            <span>🏆</span>
            <b>Achievements</b><br>
            Level up with XP, streaks, rewards & medals
          </div>
          <div class="feature-card">
            <span>🧠</span>
            <b>AI Insights</b><br>
            Discover patterns in your writing journey
          </div>
        </div>
        <div class="plan-block">
          <b>Your Free Account Includes:</b>
          <ul style="padding-left: 18px; margin:12px 0 0 0;">
            <li>✨ <b>100 AI Prompts</b> – Smart writing suggestions</li>
            <li>☁️ <b>50MB Storage</b> – Save photos & files</li>
            <li>🎯 Full access to all essential features</li>
          </ul>
          <div style="margin-top: 10px;">
            Need more? <b>Upgrade anytime!</b><br>
            🚀 <b>Pro Plan ($9.99/mo):</b> 1,000 prompts, 500MB storage<br>
            ⚡ <b>Power Plan ($19.99/mo):</b> Unlimited everything!
          </div>
        </div>
        <div class="tips-block">
          <b>Quick Start Tips:</b>
          <ul style="padding-left: 18px; margin:10px 0;">
            <li>Start with a simple mood check-in</li>
            <li>Upload a photo for AI magic</li>
            <li>Customize your journal’s look</li>
            <li>Set your first writing goal</li>
            <li>Unlock your first achievement badge</li>
            <li>Track your monthly AI prompts</li>
          </ul>
        </div>
        <p style="margin: 26px 0 12px 0;">
          Ready to begin? Just click the button above to activate your account.<br>
          Any questions? <b>Just reply</b>—our wise team is here to help! 💌
        </p>
      </div>
      <div class="footer">
        Happy journaling! 🦉✨<br>
        <span style="color:#a78bfa;">The JournOwl Team</span>
        <div class="links" style="margin-top:10px;">
          <a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a>
        </div>
        <div style="color: #9ca3af; margin-top:7px; font-size:11px;">
          You're receiving this because you signed up for JournOwl.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
Welcome to JournOwl! 🦉

Hi ${userName}!

Welcome to JournOwl, your wise writing companion. We're thrilled to have you with us.

Please verify your email to activate your account:
${verificationUrl}

What makes JournOwl special:
• Smart Editor with beautiful fonts & AI prompts
• Photo AI for creative inspiration
• XP, streaks, and achievement badges
• AI Insights into your journaling

Your Free Account Includes:
✨ 100 AI Prompts/month
☁️ 50MB Storage for photos/files
🎯 Full access to core features

Need more? Upgrade anytime:
🚀 Pro Plan ($9.99/month): 1,000 prompts + 500MB storage
⚡ Power Plan ($19.99/month): Unlimited prompts & features

Quick Start Tips:
- Do a mood check-in
- Upload a photo for AI analysis
- Customize your writing style
- Set your first goal
- Unlock achievements

Questions? Reply to this email—we’re always here!

Happy journaling! 🦉✨
The JournOwl Team
`;

  return {
    to: userEmail,
    from: 'craftyguru@1ofakindpiece.com',
    subject: '🦉 Welcome to JournOwl – Verify Your Email & Start Your Journey!',
    html,
    text
  };
}
