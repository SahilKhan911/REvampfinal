import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

function parseCsvLine(text: string) {
  const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  return text.split(re).map(s => s.replace(/^"|"$/g, '').trim());
}

async function main() {
  const launchpadBundle = await prisma.bundle.findFirst({
    where: { cohortSlug: 'launchpad' }
  });

  if (!launchpadBundle) {
    console.error('Launchpad bundle not found in DB!');
    return;
  }

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
    const phone = fields[5];
    const github = fields[6];
    const linkedin = fields[7];
    const experience = fields[8];
    const motivation = fields[9];
    const goalsString = fields[10];

    const goals = goalsString ? goalsString.split(',').map(s => s.trim()) : [];

    // Generate specific credentials
    const passChunk = crypto.randomBytes(3).toString('hex');
    const password = `Restart@${passChunk}`;
    const referralCode = `tmp_${crypto.randomBytes(3).toString('hex')}`;

    console.log(`Processing: ${email}`);

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          passwordHash: password,
          referralCode,
          githubUrl: github || null,
          linkedinUrl: linkedin || null,
        }
      });
      console.log(`  -> Created User: ${email}`);
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: password, // Forcing reset to send them a known pass
          githubUrl: github || user.githubUrl,
          linkedinUrl: linkedin || user.linkedinUrl,
        }
      });
      console.log(`  -> Updated User: ${email}`);
    }

    // Enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, bundleId: launchpadBundle.id }
    });

    if (!enrollment) {
      await prisma.enrollment.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          bundleId: launchpadBundle.id,
          status: 'ACTIVE'
        }
      });
      console.log(`  -> Enrolled in Launchpad`);
    }

    // Launchpad Profile
    const profile = await prisma.launchpadProfile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) {
      await prisma.launchpadProfile.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          experienceLevel: experience || 'beginner',
          goals: goals,
          motivation: motivation || null,
        }
      });
      console.log(`  -> Created Profile`);
    }

    // Send Email
    try {
      await resend.emails.send({
        from: 'Revamp <noreply@letsrevamp.in>',
        to: email,
        subject: `🚀 Welcome to REstart Launchpad, ${name.split(' ')[0]}!`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
            <img src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230" alt="REvamp" style="height: 60px; margin-bottom: 30px;" />
            <h1 style="font-size: 28px; margin-bottom: 16px;">Welcome to Launchpad! 🚀</h1>
            <p style="color: #999; font-size: 16px; line-height: 1.6;">Hey ${name.split(' ')[0]}, your enrollment is confirmed.</p>
            <p style="color: #999; font-size: 16px; line-height: 1.6;">We've created an account for you so you can access the dashboard and checking your launchpad status. We will be starting soon, so join the community links in your dashboard.</p>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #333;">
              <h3 style="margin-top: 0;">Your Login Credentials</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>

            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              <strong>Instructions:</strong> Head over to the dashboard URL below, use the credentials provided to log in. You'll find your Launchpad access on the homepage along with Discord and WhatsApp invites!
            </p>
            
            <a href="https://letsrevamp.in/dashboard" style="display: inline-block; margin-top: 24px; padding: 14px 32px; background: #0085FF; color: #fff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px;">Go to Dashboard →</a>
            
            <p style="color: #555; font-size: 12px; margin-top: 40px;">© 2026 REvamp Tech Collective</p>
          </div>
        `
      });
      console.log(`  -> Sent welcome email to ${email}`);
    } catch (e: any) {
      console.error(`  -> Failed to send email:`, e.message);
    }
  }

  console.log('Finished processing all students.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
