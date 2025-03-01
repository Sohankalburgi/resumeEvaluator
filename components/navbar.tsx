import Link from 'next/link';
import React from 'react';


const Navbar = () => {
    return (
        <nav className={'bg-gray-800 p-4 mb-10'}>
            <div className={'container mx-auto flex justify-between items-center'}>
                <div className={'text-white text-lg font-bold'}>Resume Evaluator </div>
                <div className={'space-x-4'}>
                    <Link href="/">Home</Link>
                    <Link href="/form">Evaluate</Link>
                    <Link href="/TopList">Search Best</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;