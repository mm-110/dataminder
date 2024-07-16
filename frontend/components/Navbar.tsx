import React from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa'; // Importa l'icona delle barre da react-icons

const Navbar = () => {
    return (
        <div className='navbar'>
            {/* <div></div> Aggiungi un elemento vuoto per occupare lo spazio a destra */}
            <h2 style={{margin: 0, alignItems: 'center' }}>.dataminder</h2>
            <div className="dropdown">
                <button className="dropbtn"><FaBars /> Menu</button> {/* Aggiungi l'icona delle barre al pulsante del menu */}
                <div className="dropdown-content">
                    <Link href="/profile">
                        <a className='menu-content'>Profile</a>
                    </Link>
                    <Link href="/myNFTs">
                        <a className='menu-content'>MyNFTs</a>
                    </Link>
                    <Link href="/explorer">
                        <a className='menu-content'>Explorer</a>
                    </Link>
                    <Link href="/receivedRequests">
                        <a className='menu-content'>Received Requests</a>
                    </Link>
                    <Link href="/forwardedRequests">
                        <a className='menu-content'>Forwarded Requests</a>
                    </Link>
                </div>
            </div>
            
            
        </div>
    );
}

export default Navbar;
