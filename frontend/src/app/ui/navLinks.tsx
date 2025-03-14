  import "./navLinks.css"
  import Link from "next/link";
  const links = [
    { name: "Log in", href:"/login"},
    {name: 'Sign up',href: "/signup"}
  ];
  
  export default function NavLinks() {
    return (
      <>
        {links.map((link) => {
          return (
            <Link key={link.name} href={link.href} className="link">
              <p>{link.name}</p>
            </Link>
          );
        })}
      </>
    );
  };