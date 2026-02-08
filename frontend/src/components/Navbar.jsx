import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/academy4.png';
function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm ring-1 ring-gray-100">
                            <img src={logo} alt=" أكاديمية ستينج" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">

                            أكاديمية ستينج </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#home" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            الرئيسية
                        </a>
                        <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            عن المدرسة
                        </a>
                        <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                            تواصل معنا
                        </a>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30"
                        >
                            دخول المسؤول
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
                        <div className="flex flex-col gap-4">
                            <a href="#home" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                                الرئيسية
                            </a>
                            <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                                عن المدرسة
                            </a>
                            <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                                تواصل معنا
                            </a>
                            <Link
                                to="/login"
                                className="px-5 py-2.5 rounded-lg gradient-primary text-white font-medium text-center"
                            >
                                دخول المسؤول
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
