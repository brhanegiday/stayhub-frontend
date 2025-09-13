"use client";

import { Shield, Heart, Clock, Award } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Shield,
            title: "Secure Booking",
            description: "Your payments are protected with bank-level security and our booking guarantee.",
        },
        {
            icon: Heart,
            title: "Trusted Hosts",
            description: "All hosts are verified and rated by our community of travelers worldwide.",
        },
        {
            icon: Clock,
            title: "24/7 Support",
            description: "Get help whenever you need it with our round-the-clock customer support.",
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Find a lower price elsewhere? We'll match it and give you an extra 5% off.",
        },
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose StayHub?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We&apos;re committed to providing you with the best booking experience possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
