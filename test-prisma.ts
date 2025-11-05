import { prisma } from './src/lib/db';

async function testContactMessage() {
  const message = await prisma.contactMessage.create({
    data: {
      name: 'Test',
      email: 'test@example.com',
      projectType: 'Test',
      message: 'Test message',
      privacyAccepted: true,
      marketingConsent: false,
    }
  });
  console.log(message);
}