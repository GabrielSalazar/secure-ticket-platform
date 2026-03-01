import { Resend } from 'resend';

// Only initialize if an API key is provided
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

// Helper to determine the sender email (must be a verified domain in Resend)
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';

export async function sendPurchaseConfirmation(
    buyerEmail: string,
    buyerName: string | null,
    eventTitle: string,
    ticketId: string,
    transactionId: string
) {
    if (!resend) {
        console.log('Skipping purchase email: RESEND_API_KEY is not defined.');
        return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const ticketUrl = `${appUrl}/tickets/${ticketId}/view`;

    try {
        await resend.emails.send({
            from: `Platform Tickets <${SENDER_EMAIL}>`,
            to: buyerEmail,
            subject: `Seu ingresso para ${eventTitle} está garantido! 🎟️`,
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                    <h2>Olá ${buyerName || ''}, sucesso! 🎉</h2>
                    <p>Seu pagamento foi confirmado e seu ingresso para <strong>${eventTitle}</strong> já está disponível na sua conta.</p>
                    <p>Clique no botão abaixo para acessar o seu QR Code e apresentá-lo na portaria do evento:</p>
                    <div style="margin: 30px 0;">
                        <a href="${ticketUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Ver Meu Ingresso
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Identificador da Transação: ${transactionId}</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                    <p style="color: #888; font-size: 12px;">Se você não solicitou esta compra, por favor ignore este email.</p>
                </div>
            `,
        });
        console.log(`Purchase confirmation email sent to ${buyerEmail}`);
    } catch (error) {
        console.error('Failed to send purchase email:', error);
    }
}

export async function sendSaleNotification(
    sellerEmail: string,
    sellerName: string | null,
    eventTitle: string,
    amount: number
) {
    if (!resend) {
        console.log('Skipping sale email: RESEND_API_KEY is not defined.');
        return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const dashboardUrl = `${appUrl}/dashboard`;

    try {
        await resend.emails.send({
            from: `Platform Sales <${SENDER_EMAIL}>`,
            to: sellerEmail,
            subject: `Vendido! Seu ingresso de ${eventTitle} foi comprado 💰`,
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                    <h2>Parabéns ${sellerName || ''}! 🚀</h2>
                    <p>Alguém acabou de comprar o seu ingresso para o evento <strong>${eventTitle}</strong>.</p>
                    <p>O valor de <strong>R$ ${amount.toFixed(2)}</strong> já foi creditado na sua carteira na plataforma e estará liberado para saque seguindo as regras de liberação.</p>
                    <div style="margin: 30px 0;">
                        <a href="${dashboardUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Acessar Dashboard
                        </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                    <p style="color: #888; font-size: 12px;">Dúvidas? Acesse nosso suporte na plataforma.</p>
                </div>
            `,
        });
        console.log(`Sale notification email sent to ${sellerEmail}`);
    } catch (error) {
        console.error('Failed to send sale notification email:', error);
    }
}
