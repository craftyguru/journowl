import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailTemplate {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: { [key: string]: string };
  mailSettings?: {
    sandboxMode?: { enable: boolean };
    bypassListManagement?: { enable: boolean };
  };
}

function getBaseUrl() {
  if (process.env.REPLIT_DOMAINS) return `https://${process.env.REPLIT_DOMAINS}`;
  if (process.env.BASE_URL) return process.env.BASE_URL;
  return 'http://localhost:5000';
}

export function createWelcomeEmailTemplate(
  userEmail: string,
  userName: string,
  verificationToken: string
): EmailTemplate {
  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <style>
      @keyframes rainbow-bg {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes bounce-owl {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
        40% { transform: translateY(-20px) scale(1.1); }
        60% { transform: translateY(-10px) scale(1.05); }
      }
      @keyframes sparkle-dance {
        0%, 100% { opacity: 0.4; transform: scale(0.7) rotate(0deg); }
        25% { opacity: 1; transform: scale(1.3) rotate(90deg); }
        50% { opacity: 0.6; transform: scale(1.1) rotate(180deg); }
        75% { opacity: 1; transform: scale(1.5) rotate(270deg); }
      }
      @keyframes mega-glow {
        0%, 100% { 
          box-shadow: 0 0 25px #ff1744, 0 0 50px #ff1744, 0 0 75px #ff1744, 0 0 100px #ff1744;
          transform: scale(1);
        }
        25% { 
          box-shadow: 0 0 35px #00e5ff, 0 0 70px #00e5ff, 0 0 105px #00e5ff, 0 0 140px #00e5ff;
          transform: scale(1.03);
        }
        50% { 
          box-shadow: 0 0 30px #76ff03, 0 0 60px #76ff03, 0 0 90px #76ff03, 0 0 120px #76ff03;
          transform: scale(1.06);
        }
        75% { 
          box-shadow: 0 0 40px #ffea00, 0 0 80px #ffea00, 0 0 120px #ffea00, 0 0 160px #ffea00;
          transform: scale(1.03);
        }
      }
      @keyframes pulse-crazy {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.15) rotate(5deg); }
        50% { transform: scale(1.3) rotate(-5deg); }
        75% { transform: scale(1.15) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      @keyframes floating-stars {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(120deg); }
        66% { transform: translateY(-10px) rotate(240deg); }
      }
      .rainbow-header { 
        background: linear-gradient(-45deg, #ff0080, #ff8c00, #40e0d0, #ff1493, #00ff7f, #ff69b4, #1e90ff, #ffd700);
        background-size: 800% 800%;
        animation: rainbow-bg 2s ease infinite;
      }
      .bounce-owl { animation: bounce-owl 2.5s infinite; }
      .sparkle-dance { animation: sparkle-dance 1.5s infinite; }
      .mega-glow { animation: mega-glow 2s infinite; }
      .pulse-crazy { animation: pulse-crazy 1.8s infinite; }
      .floating-stars { animation: floating-stars 3s infinite; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff1493, #00ff7f);font-family:Arial,sans-serif;">
    
    <!-- MEGA ANIMATED CONTAINER -->
    <div style="max-width:650px;margin:15px auto;background:#fff;border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,0.5);overflow:hidden;border:5px solid #ff0080;">
      
      <!-- INSANE RAINBOW HEADER -->
      <div class="rainbow-header" style="padding:60px 40px;text-align:center;color:#fff;position:relative;border-bottom:5px solid #ffd700;">
        
        <!-- FLOATING SPARKLES EVERYWHERE -->
        <div style="position:absolute;top:15px;left:30px;font-size:35px;" class="sparkle-dance floating-stars">✨</div>
        <div style="position:absolute;top:25px;right:40px;font-size:28px;" class="sparkle-dance floating-stars">⭐</div>
        <div style="position:absolute;top:50px;left:100px;font-size:32px;" class="sparkle-dance floating-stars">💫</div>
        <div style="position:absolute;bottom:20px;left:50px;font-size:30px;" class="sparkle-dance floating-stars">🌟</div>
        <div style="position:absolute;bottom:30px;right:70px;font-size:26px;" class="sparkle-dance floating-stars">✨</div>
        <div style="position:absolute;top:40px;right:120px;font-size:24px;" class="sparkle-dance floating-stars">💥</div>
        <div style="position:absolute;bottom:50px;left:150px;font-size:28px;" class="sparkle-dance floating-stars">🎉</div>
        
        <!-- MEGA BOUNCING OWL -->
        <div class="bounce-owl" style="font-size:100px;margin-bottom:20px;text-shadow:0 0 40px rgba(255,255,255,1);filter:drop-shadow(0 0 20px #ffd700);">🦉</div>
        
        <!-- ANIMATED TITLE -->
        <h1 class="pulse-crazy" style="margin:0 0 15px 0;font-size:48px;text-shadow:3px 3px 6px rgba(0,0,0,0.5);background:linear-gradient(45deg, #fff, #ffd700, #ff69b4, #00ff7f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:bold;">
          WELCOME TO JOURNOWL!
        </h1>
        
        <!-- MEGA EXCITED SUBTITLE -->
        <div style="font-size:24px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.4);margin-bottom:10px;">
          🚀 YOUR EPIC AI WRITING ADVENTURE STARTS NOW! 🚀
        </div>
        <div style="font-size:18px;text-shadow:1px 1px 2px rgba(0,0,0,0.3);">
          Get ready for the most AMAZING journaling experience ever! 🎯✨
        </div>
      </div>
      
      <!-- MIND-BLOWING MAIN CONTENT -->
      <div style="padding:45px 35px;background:linear-gradient(135deg, #ffeaa7, #fab1a0, #fd79a8, #fdcb6e);">
        
        <!-- SUPER EXCITED GREETING -->
        <h2 style="color:#2d3436;font-size:32px;text-align:center;margin-bottom:25px;text-shadow:2px 2px 4px rgba(0,0,0,0.1);">
          🎊 HEY ${userName}! READY TO BLOW YOUR MIND?! 🎊
        </h2>
        
        <!-- INSANE VERIFICATION BUTTON SECTION -->
        <div class="mega-glow" style="background:linear-gradient(135deg, #ff7675, #fd79a8, #fdcb6e, #e17055);padding:35px;border-radius:25px;margin:30px 0;text-align:center;border:4px solid #d63031;position:relative;">
          <div style="position:absolute;top:10px;left:20px;font-size:25px;" class="sparkle-dance">🔥</div>
          <div style="position:absolute;top:10px;right:20px;font-size:25px;" class="sparkle-dance">💎</div>
          <div style="position:absolute;bottom:10px;left:30px;font-size:25px;" class="sparkle-dance">⚡</div>
          <div style="position:absolute;bottom:10px;right:30px;font-size:25px;" class="sparkle-dance">🎯</div>
          
          <h3 style="color:#fff;margin:0 0 20px 0;font-size:28px;text-shadow:2px 2px 4px rgba(0,0,0,0.5);">
            🌟 CLICK NOW FOR INSTANT SUPERPOWERS! 🌟
          </h3>
          
          <a href="${verificationUrl}" class="pulse-crazy" style="display:inline-block;padding:25px 50px;background:linear-gradient(135deg,#00b894,#00cec9,#0984e3,#6c5ce7);color:#fff;border-radius:60px;font-weight:bold;font-size:24px;text-decoration:none;text-shadow:2px 2px 4px rgba(0,0,0,0.4);border:4px solid #fff;box-shadow:0 15px 35px rgba(0,0,0,0.3);">
            ⚡ VERIFY EMAIL & UNLEASH THE MAGIC! ⚡
          </a>
          
          <p style="margin:20px 0 0 0;color:#fff;font-weight:bold;font-size:18px;text-shadow:1px 1px 2px rgba(0,0,0,0.4);">
            🦸‍♀️ Transform into a journaling superhero instantly! 🦸‍♂️
          </p>
        </div>
        
        <!-- INCREDIBLE FEATURES SHOWCASE -->
        <div style="background:linear-gradient(135deg, #a29bfe, #6c5ce7, #fd79a8, #fdcb6e);padding:40px;border-radius:25px;margin:35px 0;border:4px solid #6c5ce7;">
          <h3 style="color:#fff;text-align:center;font-size:28px;margin-bottom:30px;text-shadow:2px 2px 4px rgba(0,0,0,0.4);">
            🌈 PREPARE TO HAVE YOUR MIND BLOWN! 🌈
          </h3>
          
          <!-- FEATURE GRID WITH ANIMATIONS -->
          <table cellpadding="15" cellspacing="0" style="width:100%;">
            <tr>
              <td style="width:50%;background:rgba(255,255,255,0.95);padding:25px;border-radius:20px;text-align:center;border:3px solid #ff7675;">
                <div class="bounce-owl" style="font-size:50px;margin-bottom:15px;">🎨</div>
                <h4 style="color:#2d3436;margin:0;font-size:18px;font-weight:bold;">GENIUS AI EDITOR</h4>
                <p style="color:#636e72;font-size:14px;margin:8px 0;">Mind-reading fonts, colors & prompts that know what you want before YOU do!</p>
              </td>
              <td style="width:50%;background:rgba(255,255,255,0.95);padding:25px;border-radius:20px;text-align:center;border:3px solid #00b894;">
                <div class="bounce-owl" style="font-size:50px;margin-bottom:15px;">📸</div>
                <h4 style="color:#2d3436;margin:0;font-size:18px;font-weight:bold;">PHOTO WIZARD AI</h4>
                <p style="color:#636e72;font-size:14px;margin:8px 0;">Upload ANY photo and watch the AI create INSTANT story magic!</p>
              </td>
            </tr>
            <tr>
              <td style="background:rgba(255,255,255,0.95);padding:25px;border-radius:20px;text-align:center;border:3px solid #fdcb6e;">
                <div class="bounce-owl" style="font-size:50px;margin-bottom:15px;">🏆</div>
                <h4 style="color:#2d3436;margin:0;font-size:18px;font-weight:bold;">LEGENDARY ACHIEVEMENTS</h4>
                <p style="color:#636e72;font-size:14px;margin:8px 0;">XP explosions, streak fire, epic badges & rewards that'll make you famous!</p>
              </td>
              <td style="background:rgba(255,255,255,0.95);padding:25px;border-radius:20px;text-align:center;border:3px solid #e17055;">
                <div class="bounce-owl" style="font-size:50px;margin-bottom:15px;">🧠</div>
                <h4 style="color:#2d3436;margin:0;font-size:18px;font-weight:bold;">MIND-READER AI</h4>
                <p style="color:#636e72;font-size:14px;margin:8px 0;">Discovers your secret writing DNA and unlocks hidden creative powers!</p>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- EXPLOSIVE FREE PACKAGE -->
        <div style="background:linear-gradient(135deg, #ff9ff3, #f368e0, #ff3838, #ff9500);padding:30px;border-radius:25px;margin:30px 0;border:4px solid #ff3838;">
          <h3 style="color:#fff;text-align:center;font-size:26px;margin-bottom:25px;text-shadow:2px 2px 4px rgba(0,0,0,0.4);">
            🎁 YOUR INSANE FREE TREASURE CHEST! 🎁
          </h3>
          
          <table cellpadding="12" cellspacing="0" style="width:100%;">
            <tr>
              <td style="width:33%;background:rgba(255,255,255,0.95);padding:20px;border-radius:15px;text-align:center;border:2px solid #ff3838;">
                <div class="pulse-crazy" style="font-size:40px;margin-bottom:10px;">✨</div>
                <strong style="color:#2d3436;font-size:16px;">100 AI PROMPTS</strong>
                <div style="color:#636e72;font-size:12px;font-weight:bold;">EVERY SINGLE MONTH!</div>
              </td>
              <td style="width:33%;background:rgba(255,255,255,0.95);padding:20px;border-radius:15px;text-align:center;border:2px solid #00b894;">
                <div class="pulse-crazy" style="font-size:40px;margin-bottom:10px;">☁️</div>
                <strong style="color:#2d3436;font-size:16px;">50MB STORAGE</strong>
                <div style="color:#636e72;font-size:12px;font-weight:bold;">FOR ALL YOUR PHOTOS!</div>
              </td>
              <td style="width:33%;background:rgba(255,255,255,0.95);padding:20px;border-radius:15px;text-align:center;border:2px solid #fdcb6e;">
                <div class="pulse-crazy" style="font-size:40px;margin-bottom:10px;">🎯</div>
                <strong style="color:#2d3436;font-size:16px;">ALL FEATURES</strong>
                <div style="color:#636e72;font-size:12px;font-weight:bold;">COMPLETE ACCESS!</div>
              </td>
            </tr>
          </table>
          
          <div style="margin-top:25px;text-align:center;">
            <p style="color:#fff;font-weight:bold;margin:0 0 15px 0;font-size:18px;text-shadow:1px 1px 2px rgba(0,0,0,0.4);">
              🔥 WANT TO GO TOTALLY INSANE?! 🔥
            </p>
            <div style="text-align:center;">
              <span style="background:rgba(255,255,255,0.95);padding:12px 20px;border-radius:15px;font-size:16px;margin:8px;display:inline-block;border:2px solid #6c5ce7;">
                🚀 <strong>PRO:</strong> 1,000 prompts + POWER! ($9.99/mo)
              </span>
              <span style="background:rgba(255,255,255,0.95);padding:12px 20px;border-radius:15px;font-size:16px;margin:8px;display:inline-block;border:2px solid #e17055;">
                ⚡ <strong>POWER:</strong> UNLIMITED EVERYTHING! ($19.99/mo)
              </span>
            </div>
          </div>
        </div>
        
        <!-- LIGHTNING QUICK START -->
        <div style="background:linear-gradient(135deg, #74b9ff, #0984e3, #00b894, #00cec9);padding:30px;border-radius:25px;margin:30px 0;border:4px solid #0984e3;">
          <h3 style="color:#fff;text-align:center;font-size:24px;margin-bottom:20px;text-shadow:2px 2px 4px rgba(0,0,0,0.4);">
            ⚡ BECOME A LEGEND IN 30 SECONDS! ⚡
          </h3>
          
          <table cellpadding="10" cellspacing="0" style="width:100%;">
            <tr>
              <td style="width:50%;background:rgba(255,255,255,0.9);padding:18px;border-radius:15px;border:2px solid #74b9ff;">
                <div style="color:#2d3436;font-weight:bold;font-size:16px;">1️⃣ Check your epic mood! 😊</div>
              </td>
              <td style="width:50%;background:rgba(255,255,255,0.9);padding:18px;border-radius:15px;border:2px solid #00b894;">
                <div style="color:#2d3436;font-weight:bold;font-size:16px;">2️⃣ Upload magical photos! 📱</div>
              </td>
            </tr>
            <tr>
              <td style="background:rgba(255,255,255,0.9);padding:18px;border-radius:15px;border:2px solid #fdcb6e;">
                <div style="color:#2d3436;font-weight:bold;font-size:16px;">3️⃣ Set impossible goals! 🎯</div>
              </td>
              <td style="background:rgba(255,255,255,0.9);padding:18px;border-radius:15px;border:2px solid #e17055;">
                <div style="color:#2d3436;font-weight:bold;font-size:16px;">4️⃣ Unlock legendary achievements! 🏆</div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- CALL TO ACTION -->
        <div style="background:linear-gradient(135deg, #ff7675, #fd79a8, #fdcb6e, #00b894);padding:25px;border-radius:20px;text-align:center;margin:25px 0;border:3px solid #d63031;">
          <p style="color:#fff;font-size:18px;margin:0;font-weight:bold;text-shadow:1px 1px 2px rgba(0,0,0,0.4);">
            🌟 Questions? Reply now - our team is READY to make you a journaling SUPERSTAR! 🌟
          </p>
        </div>
      </div>
      
      <!-- AMAZING RAINBOW FOOTER -->
      <div class="rainbow-header" style="padding:35px 25px;text-align:center;color:#fff;">
        <div style="font-size:22px;font-weight:bold;margin-bottom:12px;text-shadow:2px 2px 4px rgba(0,0,0,0.4);">
          Happy Epic Journaling! 🦉✨🚀
        </div>
        <div style="font-size:18px;margin-bottom:15px;text-shadow:1px 1px 2px rgba(0,0,0,0.3);">
          The AMAZING JournOwl Team
        </div>
        <div style="font-size:12px;opacity:0.9;">
          You're getting this because you're about to become LEGENDARY!
        </div>
        <div style="margin-top:12px;font-size:12px;">
          <a href="#" style="color:#fff;text-decoration:none;margin:0 12px;text-shadow:1px 1px 1px rgba(0,0,0,0.3);">Unsubscribe</a> | 
          <a href="#" style="color:#fff;text-decoration:none;margin:0 12px;text-shadow:1px 1px 1px rgba(0,0,0,0.3);">Privacy Policy</a>
        </div>
      </div>
    </div>
    
    <!-- FLOATING BACKGROUND ELEMENTS -->
    <div style="position:fixed;top:10%;left:5%;font-size:30px;z-index:-1;" class="sparkle-dance floating-stars">🌟</div>
    <div style="position:fixed;top:20%;right:8%;font-size:25px;z-index:-1;" class="sparkle-dance floating-stars">✨</div>
    <div style="position:fixed;bottom:15%;left:10%;font-size:28px;z-index:-1;" class="sparkle-dance floating-stars">💫</div>
    <div style="position:fixed;bottom:25%;right:5%;font-size:32px;z-index:-1;" class="sparkle-dance floating-stars">🎉</div>
    
  </body>
  </html>
  `;

  const text = `
🦉 WELCOME TO JOURNOWL! 🦉

HEY ${userName}! READY TO BLOW YOUR MIND?!

We're SO EXCITED you joined our AMAZING writing community!

🔥 VERIFY YOUR EMAIL NOW FOR INSTANT SUPERPOWERS: 🔥
${verificationUrl}

🌟 WHY JOURNOWL WILL BLOW YOUR MIND:
🎨 GENIUS AI EDITOR - Mind-reading fonts & prompts!
📸 PHOTO WIZARD AI - Upload photos for instant story magic!
🏆 LEGENDARY ACHIEVEMENTS - XP, streaks, epic rewards!
🧠 MIND-READER AI - Discovers your secret writing powers!

🎁 YOUR INSANE FREE TREASURE CHEST:
✨ 100 AI Prompts EVERY MONTH!
☁️ 50MB Storage for all your photos!
🎯 ALL FEATURES with complete access!

🔥 WANT MORE POWER?
🚀 PRO: 1,000 prompts + extras ($9.99/mo)
⚡ POWER: UNLIMITED EVERYTHING! ($19.99/mo)

⚡ BECOME A LEGEND IN 30 SECONDS:
1️⃣ Check your epic mood!
2️⃣ Upload magical photos!
3️⃣ Set impossible goals!
4️⃣ Unlock legendary achievements!

Questions? Reply now - we're ready to make you a SUPERSTAR!

Happy Epic Journaling! 🦉✨🚀
The AMAZING JournOwl Team
  `;

  return {
    to: userEmail,
    from: 'archimedes@journowl.app',
    replyTo: 'support@journowl.app',
    subject: '🦉 WELCOME TO JOURNOWL! Your Epic Writing Adventure Starts NOW! 🚀✨',
    html,
    text,
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'JournOwl Platform',
      'List-Unsubscribe': '<mailto:unsubscribe@journowl.app>',
      'Content-Type': 'text/html; charset=utf-8'
    },
    mailSettings: {
      sandboxMode: { enable: false },
      bypassListManagement: { enable: false }
    }
  };
}

export async function sendWelcomeEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const emailTemplate = createWelcomeEmailTemplate(userEmail, userName, verificationToken);
    await sgMail.send(emailTemplate);
    console.log(`Welcome email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export function createProfessionalWelcomeEmailTemplate(
  userEmail: string,
  userName: string,
  verificationToken: string
): EmailTemplate {
  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to JournOwl</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <div style="color: #ffffff; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
            🦉 JournOwl
          </div>
          <div style="color: #e2e8f0; font-size: 16px;">
            Your Intelligent Writing Companion
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <h1 style="color: #1a202c; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
            Welcome to JournOwl, ${userName}!
          </h1>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining our community of writers and thinkers. JournOwl combines the power of AI with beautiful design to make journaling an inspiring daily habit.
          </p>
          
          <!-- Verification Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: #ffffff; text-decoration: none; padding: 16px 32px; 
                      border-radius: 8px; font-weight: 600; font-size: 16px; 
                      box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
              Verify Your Email Address
            </a>
          </div>
          
          <!-- Features -->
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">What you get with JournOwl:</h3>
            <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>AI-powered writing prompts and insights</li>
              <li>Photo analysis and memory extraction</li>
              <li>Progress tracking and achievements</li>
              <li>Beautiful, customizable writing interface</li>
              <li>100 AI prompts monthly (Free plan)</li>
              <li>50MB storage for photos and attachments</li>
            </ul>
          </div>
          
          <!-- Upgrade Options -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #718096; font-size: 14px; margin-bottom: 15px;">
              Ready for more? Check out our premium plans:
            </p>
            <div style="display: inline-block; margin: 0 10px;">
              <span style="background-color: #e6fffa; color: #234e52; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">
                Pro: $9.99/month
              </span>
            </div>
            <div style="display: inline-block; margin: 0 10px;">
              <span style="background-color: #fef5e7; color: #744210; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">
                Power: $19.99/month
              </span>
            </div>
          </div>
          
          <p style="color: #718096; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            If you have any questions, simply reply to this email. We're here to help make your writing journey amazing.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #edf2f7; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px; margin: 0;">
            Best regards,<br>
            The JournOwl Team
          </p>
          <div style="margin-top: 15px;">
            <a href="mailto:support@journowl.app" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Support</a>
            <a href="#" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Unsubscribe</a>
            <a href="#" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to JournOwl, ${userName}!

Thank you for joining our community of writers and thinkers. JournOwl combines the power of AI with beautiful design to make journaling an inspiring daily habit.

Verify your email address: ${verificationUrl}

What you get with JournOwl:
- AI-powered writing prompts and insights
- Photo analysis and memory extraction  
- Progress tracking and achievements
- Beautiful, customizable writing interface
- 100 AI prompts monthly (Free plan)
- 50MB storage for photos and attachments

Ready for more? Check out our premium plans:
- Pro: $9.99/month
- Power: $19.99/month

If you have any questions, simply reply to this email. We're here to help make your writing journey amazing.

Best regards,
The JournOwl Team
  `;

  return {
    to: userEmail,
    from: 'archimedes@journowl.app',
    replyTo: 'support@journowl.app', 
    subject: 'Welcome to JournOwl - Verify Your Account',
    html,
    text,
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'JournOwl Platform',
      'List-Unsubscribe': '<mailto:unsubscribe@journowl.app>',
      'Content-Type': 'text/html; charset=utf-8'
    },
    mailSettings: {
      sandboxMode: { enable: false },
      bypassListManagement: { enable: false }
    }
  };
}

export function createSimpleTestEmailTemplate(
  userEmail: string,
  userName: string
): EmailTemplate {
  return {
    to: userEmail,
    from: 'archimedes@journowl.app',
    subject: 'JournOwl Test Email - Simple Version',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Hello ${userName}!</h1>
        <p>This is a simple test email to verify our SendGrid configuration is working.</p>
        <p>If you received this email, SendGrid is working correctly!</p>
        <p>Best regards,<br>The JournOwl Team</p>
      </div>
    `,
    text: `
Hello ${userName}!

This is a simple test email to verify our SendGrid configuration is working.

If you received this email, SendGrid is working correctly!

Best regards,
The JournOwl Team
    `
  };
}

export async function sendSimpleTestEmail(userEmail: string, userName: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const emailTemplate = createSimpleTestEmailTemplate(userEmail, userName);
    await sgMail.send(emailTemplate);
    console.log(`Simple test email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send simple test email:', error);
    return false;
  }
}