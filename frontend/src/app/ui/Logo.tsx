import "./Logo.css"
import Link from "next/link";

export default function Logo(){
    return(
        <Link key="Home" href={"/"} className="logo">
            <p>
                CATARSIS
            </p>
        </Link>
    );
};