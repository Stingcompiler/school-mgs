import { MapPin, Phone, Mail, GraduationCap, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo2 from '../assets/academy4.png';

function Footer() {
    return (
        <footer id="contact" className="bg-gray-900 text-white">
            {/* Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white font-medium mb-4">
                        تواصل معنا
                    </span>
                    <h2 className="text-3xl font-bold mb-4">نحن هنا لمساعدتك</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        لأي استفسارات أو ملاحظات، لا تتردد في التواصل معنا
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Address */}
                    <div className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">العنوان</h3>
                        <p className="text-gray-400">
                            <br />
                            الفردوس إستوب الستين مع الفردوس
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">الهاتف</h3>
                        <p className="text-gray-400">
                            <a href="https://wa.me/249902929451" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                0902929451
                            </a>
                        </p>
                    </div>

                    {/* Email */}
                    <div className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                        <p className="text-gray-400">
                            <a href="mailto:musabstingdev@gmail.com" className="hover:text-white transition-colors">
                                musabstingdev@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden 
                            flex items-center justify-center bg-white shadow-sm ring-1 ring-gray-400">
                                <img src={logo2} alt=" أكاديمية ستينج"
                                    className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold text-gray-400">

                                أكاديمية ستينج </span>
                        </Link>

                        {/* Copyright */}
                        <p className="text-gray-400 text-sm">
                            أكاديمية ستينج
                            © 2024  . جميع الحقوق محفوظة.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
