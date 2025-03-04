import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms Of Services',
};

export default function Tos() {
    const appName = process.env.APP_NAME || '[App]';
    const companyName = process.env.COMPANY_NAME || '[Company]';

    return (
        <article className="max-w-7xl mx-auto h-full flex flex-col justify-between">
            <h1>Terms of Service</h1>
            <p>Welcome to <strong>{appName}</strong>, provided by <strong>{companyName}</strong> ("we", "our", "us"). By using <strong>{appName}</strong>, you agree to these Terms of Service ("Terms").</p>

            <h2>1. User Accounts</h2>
            <p>You must register an account to use certain features of <strong>{appName}</strong>. You agree to provide accurate information and keep your account credentials secure. You are responsible for all activity under your account.</p>

            <h2>2. Subscriptions and Payments</h2>
            <p><strong>{appName}</strong> offers free and paid plans. Paid plans are billed <strong>[monthly/annually]</strong> and renew automatically unless canceled. Refunds are <strong>[allowed/not allowed]</strong> as per our refund policy. Payment processing is handled by third-party providers, and we disclaim liability for their actions.</p>
            <p>If you cancel a subscription, you will retain access to paid features until the end of the current billing cycle.</p>

            <h2>3. Content and Ownership</h2>
            <p>You retain ownership of the content you upload to <strong>{appName}</strong>. By using the service, you grant us a non-exclusive, worldwide, royalty-free license to <strong>[describe use, e.g., display, distribute, etc.]</strong>. Unauthorized sharing or reproduction of paid content is prohibited.</p>

            <h2>4. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Engage in illegal or unauthorized activities.</li>
                <li>Disrupt or interfere with the service's functionality.</li>
                <li>Upload harmful or malicious content, including viruses or spam.</li>
                <li>Scrape or collect data without permission.</li>
            </ul>

            <h2>5. Beta Features</h2>
            <p>We may offer beta or experimental features. These features are provided "as is" and may change or be removed without notice.</p>

            <h2>6. Data Collection and Privacy</h2>
            <p>Your use of <strong>{appName}</strong> is subject to our <a href="[Privacy Policy URL]">Privacy Policy</a>. We collect and process data as described in the policy, including for improving our services.</p>

            <h2>7. Third-party Services</h2>
            <p><strong>{appName}</strong> may integrate with third-party services. We are not responsible for the availability, security, or performance of these services.</p>

            <h2>8. Liability</h2>
            <p>We are not liable for:</p>
            <ul>
                <li>Loss of data, revenue, or business opportunities.</li>
                <li>Service interruptions or errors beyond our control.</li>
                <li>Actions of third-party payment processors or integrated services.</li>
            </ul>
            <p>Our maximum liability is limited to the amount paid by you for the service in the past 12 months.</p>

            <h2>9. Dispute Resolution</h2>
            <p>Disputes arising from these Terms are governed by the laws of <strong>[Country/State]</strong>. You agree to resolve disputes through <strong>[arbitration/courts]</strong> in <strong>[jurisdiction]</strong>. Any claims must be filed within one year of the cause of action.</p>

            <h2>10. Accessibility</h2>
            <p>We are committed to making <strong>{appName}</strong> accessible to all users. If you encounter accessibility issues, please contact us at <a href="mailto:[support email]"><strong>[support email]</strong></a>.</p>

            <h2>11. Updates</h2>
            <p>We reserve the right to update these Terms at any time. Users will be notified via <strong>[email/website notification]</strong>. Continued use of the service indicates acceptance of updated Terms.</p>

            <h2>12. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:[support email]"><strong>[support email]</strong></a>.</p>

            <p><small>Last updated: <strong>[Date]</strong></small></p>
        </article>
    );
}