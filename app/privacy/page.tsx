export const metadata = { title: "Privacy | FieldSignals" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        FieldSignals is an early-stage software service operated by an individual
        in Canada. This policy explains, in plain language, how data is handled
        today.
      </p>

      <h2>Data we access</h2>
      <p>
        If you connect a Jobber account, we access <strong>read-only</strong> data
        required to generate operational summaries, such as jobs, schedules,
        quotes, invoices, payments, clients, and users.
      </p>

      <h2>Data we store</h2>
      <p>
        We store the minimum data necessary to operate the service, including
        encrypted access tokens and weekly aggregated metrics. We aim to minimize
        storage of raw records and personal information.
      </p>

      <h2>How data is used</h2>
      <ul>
        <li>To generate and deliver summaries and emails</li>
        <li>To operate and improve the service</li>
        <li>To provide support if you contact us</li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell your data.</li>
        <li>We do not use your data for advertising.</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You may disconnect your Jobber account at any time. You may also request
        data deletion by contacting us.
      </p>

      <h2>Changes</h2>
      <p>
        This policy may change as the product evolves. Updates will be posted on
        this page.
      </p>

      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href="mailto:support@fieldsignals.app">
          support@fieldsignals.app
        </a>
      </p>
    </main>
  );
}
