import Link from 'next/link';

const header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Register', href: '/auth/register' },
    !currentUser && { label: 'Log In', href: '/auth/login' },
    currentUser && { label: 'Create New Ticket', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Log Out', href: '/auth/logout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="shadow-sm blue-100 navbar navbar-light bg-light mb-4">
      <Link href="/">
        <a className="navbar-brand">Get the Tix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default header
