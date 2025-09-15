import React from 'react';

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center text-white p-10 mt-10 border-t-1 border-neutral">
            <nav className="grid grid-flow-col gap-4">
                <a href='/' className="link link-hover text-2xl">Accueil</a>
                <a href='/movies/list' className="link link-hover text-2xl">Films</a>
                <a href='/tv/list' className="link link-hover text-2xl">Séries</a>
            </nav>
            <nav>
                <div className="grid grid-flow-col gap-4">
                
                <a href='https://github.com/antoine-leca' target="_blank">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                </a>
                <a href='mailto:antoine.leca.forma@gmail.com'>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current">
                    <path
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                    </svg>
                </a>
                </div>
            </nav>
            <aside>
                <p>Copyright © {new Date().getFullYear()} - Tous droits réservés par <a className='hover:underline' href="https://antoine-leca.students-laplateforme.io/">Antoine LECA</a></p>
            </aside>
        </footer>
    );
};

export default Footer;