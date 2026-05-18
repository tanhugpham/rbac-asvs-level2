import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          🔐 RBAC System
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          Role-Based Access Control System
          <br />
          Compliant with OWASP ASVS Level 2
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            Test Accounts
          </h2>
          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
            <p><strong>Admin:</strong> admin@example.com / Admin@123456</p>
            <p><strong>Staff:</strong> staff@example.com / Staff@123456</p>
            <p><strong>Customer:</strong> customer@example.com / Customer@123456</p>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            Features
          </h2>
          <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>JWT-based authentication with HTTP-only cookies</li>
            <li>Role-Based Access Control (RBAC)</li>
            <li>Fine-grained permissions</li>
            <li>Server-side authorization checks</li>
            <li>Audit logging for security events</li>
            <li>Fail-secure by default</li>
            <li>Protection against vertical and horizontal privilege escalation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
