import * as React from 'react';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className='global-wrapper'>
      <header className='global-header'>Demo blog</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href='https://nextjs.org'>Next.js</a>
      </footer>
    </div>
  );
};

export default Layout;
