import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./shared/schema.js";
import { eq } from "drizzle-orm";
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Database connection
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });
const db = drizzle(sql);

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function createTestUserAndSendVerification() {
  try {
    console.log('🚀 Creating test user and sending verification email...');
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : 'http://localhost:5000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
    
    console.log('🔑 Generated verification token:', verificationToken);
    console.log('🔗 Verification URL:', verificationUrl);
    
    // Create or update the test user in database
    const testUserData = {
      email: 'CraftyGuru@1ofakindpiece.com',
      username: 'CraftyGuruTest',
      passwordHash: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      requiresEmailVerification: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert or update user
    const [user] = await db.insert(users).values(testUserData).onConflictDoUpdate({
      target: users.email,
      set: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        requiresEmailVerification: true,
        emailVerified: false,
        updatedAt: new Date()
      }
    }).returning();
    
    console.log('✅ Test user created/updated in database:', user.id);
    
    // Create the MEGA ANIMATED verification email
    const emailHtml = `
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
        .rainbow-header { 
          background: linear-gradient(-45deg, #ff0080, #ff8c00, #40e0d0, #ff1493, #00ff7f, #ff69b4, #1e90ff, #ffd700);
          background-size: 800% 800%;
          animation: rainbow-bg 2s ease infinite;
        }
        .bounce-owl { animation: bounce-owl 2.5s infinite; }
        .sparkle-dance { animation: sparkle-dance 1.5s infinite; }
        .mega-glow { animation: mega-glow 2s infinite; }
        .pulse-crazy { animation: pulse-crazy 1.8s infinite; }
      </style>
    </head>
    <body style="margin:0;padding:0;background:linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff1493, #00ff7f);font-family:Arial,sans-serif;">
      
      <div style="max-width:650px;margin:15px auto;background:#fff;border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,0.5);overflow:hidden;border:5px solid #ff0080;">
        
        <!-- INSANE RAINBOW HEADER -->
        <div class="rainbow-header" style="padding:60px 40px;text-align:center;color:#fff;position:relative;border-bottom:5px solid #ffd700;">
          
          <!-- FLOATING SPARKLES EVERYWHERE -->
          <div style="position:absolute;top:15px;left:30px;font-size:35px;" class="sparkle-dance">✨</div>
          <div style="position:absolute;top:25px;right:40px;font-size:28px;" class="sparkle-dance">⭐</div>
          <div style="position:absolute;top:50px;left:100px;font-size:32px;" class="sparkle-dance">💫</div>
          <div style="position:absolute;bottom:20px;left:50px;font-size:30px;" class="sparkle-dance">🌟</div>
          <div style="position:absolute;bottom:30px;right:70px;font-size:26px;" class="sparkle-dance">✨</div>
          
          <!-- MEGA BOUNCING OWL -->
          <div class="bounce-owl" style="font-size:100px;margin-bottom:20px;text-shadow:0 0 40px rgba(255,255,255,1);filter:drop-shadow(0 0 20px #ffd700);">🦉</div>
          
          <!-- ANIMATED TITLE -->
          <h1 class="pulse-crazy" style="margin:0 0 15px 0;font-size:48px;text-shadow:3px 3px 6px rgba(0,0,0,0.5);background:linear-gradient(45deg, #fff, #ffd700, #ff69b4, #00ff7f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:bold;">
            VERIFY YOUR EMAIL NOW!
          </h1>
          
          <div style="font-size:24px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.4);margin-bottom:10px;">
            🚀 CLICK TO ACTIVATE YOUR JOURNOWL POWERS! 🚀
          </div>
        </div>
        
        <!-- MEGA VERIFICATION BUTTON -->
        <div style="padding:45px 35px;background:linear-gradient(135deg, #ffeaa7, #fab1a0, #fd79a8, #fdcb6e);text-align:center;">
          
          <div class="mega-glow" style="background:linear-gradient(135deg, #ff7675, #fd79a8, #fdcb6e, #e17055);padding:35px;border-radius:25px;margin:30px 0;text-align:center;border:4px solid #d63031;position:relative;">
            
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
          
          <div style="font-size:16px;color:#2d3436;margin-top:25px;">
            If the button doesn't work, copy and paste this link:
            <br><a href="${verificationUrl}" style="color:#0984e3;word-break:break-all;">${verificationUrl}</a>
          </div>
          
        </div>
        
        <!-- AMAZING RAINBOW FOOTER -->
        <div class="rainbow-header" style="padding:35px 25px;text-align:center;color:#fff;">
          <div style="font-size:22px;font-weight:bold;margin-bottom:12px;text-shadow:2px 2px 4px rgba(0,0,0,0.4);">
            The AMAZING JournOwl Team 🦉✨🚀
          </div>
        </div>
      </div>
      
    </body>
    </html>
    `;
    
    // Send the verification email
    const msg = {
      to: 'CraftyGuru@1ofakindpiece.com',
      from: 'craftyguru@1ofakindpiece.com',
      subject: '🔥 VERIFY YOUR EMAIL FOR JOURNOWL SUPERPOWERS! 🦉✨',
      html: emailHtml,
      text: `🦉 VERIFY YOUR EMAIL FOR JOURNOWL! 🦉

Click this link to verify your email and activate your account:
${verificationUrl}

Or copy and paste the link into your browser.

Thanks!
The JournOwl Team`
    };
    
    const response = await sgMail.send(msg);
    console.log('✅ MEGA ANIMATED verification email sent successfully!');
    console.log('Status Code:', response[0].statusCode);
    console.log('Message ID:', response[0].headers['x-message-id']);
    console.log('📧 Email sent to: CraftyGuru@1ofakindpiece.com');
    console.log('🔗 Verification URL:', verificationUrl);
    
    // Close database connection
    await sql.end();
    
    return {
      success: true,
      verificationToken,
      verificationUrl,
      messageId: response[0].headers['x-message-id']
    };
    
  } catch (error) {
    console.error('❌ Failed to create test user and send verification email:', error);
    if (error.response?.body?.errors) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
    }
    await sql.end();
    return { success: false, error: error.message };
  }
}

createTestUserAndSendVerification();