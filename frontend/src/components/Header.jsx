import React from 'react';
import SearchBar from './SearchBar';
import CustomDivider from './CustomDivider';

const Header = () => {
    return (
        <header className="drawer drawer-end main-font-r text-(--cta-color)">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar w-full">
                    {/* Liens */}
                    <div className="hidden min-w-2/10 lg:block">
                        <ul className="flex items-center">
                        {/* Contenu du menu */}
                            <li className="dropdown dropdown-hover">
                                <a role="button" className="btn links-nav border-none shadow-none text-xl" href="/">Accueil</a>
                            </li>
                            <li className="dropdown dropdown-hover">
                                <span tabIndex={0} role="button" className="btn links-nav border-none shadow-none text-xl">Films</span>
                                <ul tabIndex={0} className="dropdown-content menu bg-(--cta-color) text-black font-bold rounded-box z-1 w-36 p-2 shadow-sm">
                                    <li><a href="/movies/list/by-genre">Par genre</a></li>
                                    <li><a href="/movies/list">Tout</a></li>
                                </ul>
                            </li>
                            <li className="dropdown dropdown-hover">
                                <span tabIndex={0} role="button" className="btn links-nav border-none shadow-none text-xl">Series</span>
                                <ul tabIndex={0} className="dropdown-content menu bg-(--cta-color) text-black font-bold rounded-box z-1 w-36 p-2 shadow-sm">
                                    <li><a href="/tv/list/by-genre">Par genre</a></li>
                                    <li><a href="/tv/list">Tout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* logo */}
                    <div className='h-full flex-1 justify-start lg:w-6/10 flex lg:justify-center items-center'>
                        <a className="mx-2 px-2 w-fit h-fit" href="/"><img className='w-24' src="/src/assets/img/logo.png" alt="" /></a>
                    </div>
                    {/* Barre de recherche */}
                    <SearchBar className="hidden lg:flex" />
                    {/* Menu burger pour le mobile */}
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current text-(--cta-color)"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
            {/* Sidebar */}
            <div className="drawer-side z-30">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-main min-h-full w-80 p-4 pt-[64px]">
                {/* Contenu de la sidebar */}
                    <li><SearchBar className="flex lg:hidden w-full" /></li>
                    <li><CustomDivider linkto='/'>Accueil</CustomDivider> </li>
                    <li>
                        <ul className='ml-0 pl-0'>
                            <li><CustomDivider>Films</CustomDivider></li>
                            <li><a className='pl-8 text-lg' href='/movies/list/by-genre'>Par genre</a></li>
                            <li><a className='pl-8 text-lg' href='/movies/list'>Tout</a></li>
                        </ul>
                    </li>
                    <li>
                        <ul className='ml-0 pl-0'>
                            <li><CustomDivider>Séries</CustomDivider></li>
                            <li><a className='pl-8 text-lg' href='/tv/list/by-genre'>Par genre</a></li>
                            <li><a className='pl-8 text-lg' href='/tv/list'>Tout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;