import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

function parseCsvLine(text: string) {
  const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  return text.split(re).map(s => s.replace(/^"|"$/g, '').trim());
}

async function main() {
  const csvPath = path.join(process.cwd(), 'Welcome to REstart Launchpad 🚀 - Sheet1.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);

  // skip header
  const dataLines = lines.slice(1);

  for (const line of dataLines) {
    const fields = parseCsvLine(line);
    if (fields.length < 5) continue;

    const name = fields[3];
    const email = fields[4].toLowerCase();

    console.log(`Sending instruction email to: ${email}`);

    try {
      await resend.emails.send({
        from: 'Revamp <noreply@letsrevamp.in>',
        to: email,
        subject: `💡 How to use your REvamp Dashboard & Earn`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
            <img src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230" alt="REvamp" style="height: 60px; margin-bottom: 30px;" />
            <h1 style="font-size: 28px; margin-bottom: 16px;">Navigating The Collective 🌐</h1>
            <p style="color: #999; font-size: 16px; line-height: 1.6;">Hey ${name.split(' ')[0]}, now that you're logged in, here's everything you need to know about navigating your dashboard and our referral ecosystem.</p>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #333;">
              <h3 style="margin-top: 0; color: #0085FF;">1. Launchpad Access & Community</h3>
              <p style="color: #ddd; font-size: 14px; line-height: 1.6;">On your main dashboard page, you will see your active enrollments. This is where you can find the <strong>WhatsApp Group</strong> and <strong>Discord constraints</strong>. Make sure you join them ASAP as all session links and announcements will drop there.</p>
              <p style="color: #ddd; font-size: 14px; line-height: 1.6;">You'll also be able to track your Launchpad sessions, mark your attendance, and submit your weekly homework right from the platform.</p>
            </div>

            <div style="background: #111; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #333;">
              <h3 style="margin-top: 0; color: #10b981;">2. The Referral System (Earn as you learn)</h3>
              <p style="color: #ddd; font-size: 14px; line-height: 1.6;">Did you know you can earn real money while learning with us? In the top section of your dashboard, you will find your <strong>unique Referral Link</strong>.</p>
              <p style="color: #ddd; font-size: 14px; line-height: 1.6;">Share this link with your friends. For every friend that enrolls in a REvamp cohort using your link, you instantly earn <strong>₹100–200</strong>! Your referral earnings are perfectly tracked on your dashboard and you can easily redeem them.</p>
            </div>

            <a href="https://letsrevamp.in/dashboard" style="display: inline-block; margin-top: 24px; padding: 14px 32px; background: #0085FF; color: #fff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">Explore Your Dashboard →</a>
            
            <p style="color: #555; font-size: 12px; margin-top: 40px;">© 2026 REvamp Tech Collective</p>
          </div>
        `
      });
      console.log(`  -> Successfully sent.`);
    } catch (e: any) {
      console.error(`  -> Failed to send email:`, e.message);
    }
  }

  console.log('Finished sending instructional emails.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
