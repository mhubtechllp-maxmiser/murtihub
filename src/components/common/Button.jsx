import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Button({
  children,
  to,
  href,
  variant = 'primary', // 'primary', 'dark', 'outline', 'outline-white'
  size = 'md', // 'sm', 'md', 'lg'
  arrow = true,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classNames = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight size={16} className="btn-hover-arrow" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classNames} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classNames} {...props}>
      {content}
    </button>
  );
}

