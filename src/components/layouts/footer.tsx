"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Home, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Send } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Blog", href: "/blog" },
        ],
        support: [
            { label: "Help Center", href: "/help" },
            { label: "Safety", href: "/safety" },
            { label: "Cancellation Options", href: "/cancellation" },
            { label: "Contact Us", href: "/contact" },
        ],
        hosting: [
            { label: "Become a Host", href: "/host" },
            { label: "Host Resources", href: "/host/resources" },
            { label: "Community Forum", href: "/community" },
            { label: "Host Protection", href: "/host/protection" },
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Sitemap", href: "/sitemap" },
        ],
    };

    const socialLinks = [
        { icon: Github, href: "https://github.com", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    ];

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-16">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                    <Home className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground">StayHub</h3>
                                    <p className="text-sm text-muted-foreground">Book with confidence</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Professional property booking platform connecting travelers with amazing accommodations
                                worldwide.
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Company Links */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Company</h4>
                            <nav className="flex flex-col space-y-2">
                                {footerLinks.company.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Support Links */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Support</h4>
                            <nav className="flex flex-col space-y-2">
                                {footerLinks.support.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Hosting Links */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Hosting</h4>
                            <nav className="flex flex-col space-y-2">
                                {footerLinks.hosting.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Stay Updated</h4>
                            <p className="text-sm text-muted-foreground">
                                Get the latest deals and travel inspiration delivered to your inbox.
                            </p>
                            <div className="flex space-x-2">
                                <Input type="email" placeholder="Enter your email" className="flex-1" />
                                <Button size="icon">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-3 h-3" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3" />
                                    <span>support@stayhub.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>San Francisco, CA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Bottom Footer */}
                <div className="py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Copyright */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>© {currentYear} StayHub. All rights reserved.</span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex items-center space-x-6">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
