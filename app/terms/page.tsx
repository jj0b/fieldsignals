export const metadata = { title: "Terms | FieldSignals" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        FieldSignals is an early-stage software service. By using it, you agree
        to these simple terms.
      </p>

      <h2>The service</h2>
      <p>
        FieldSignals provides informational summaries generated from connected
        Jobber data. The service is provided <strong>as-is</strong> and may
        change or be discontinued.
      </p>

      <h2>No guarantees</h2>
      <p>
        Information provided by FieldSignals is for general guidance only. You
        are responsible for business decisions and outcomes.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for maintaining access to your email and any
        connected third-party accounts.
      </p>

      <h2>Stopping use</h2>
      <p>
        You may stop using the service at any time and disconnect integrations.
      </p>

      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, FieldSignals is not liable for
        indirect or consequential losses arising from use of the service.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Canada and the applicable laws
        of your province or territory.
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
