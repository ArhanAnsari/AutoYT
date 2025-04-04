import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Twitter } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const otherLinks = [
    { name: "Sign Up", href: "/auth/sign-up" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/legal/privacy-policy" },
    { name: "Terms of Service", href: "/legal/terms-of-service" },
    { name: "Disclaimer", href: "/legal/disclaimer" },
    { name: "License", href: "/legal/license" },
  ];

  return (
    <footer className="mx-auto flex w-full max-w-[83rem] flex-col gap-10 px-6 py-12">
      <div className="flex w-full flex-col lg:flex-row lg:justify-between gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-x-2">
              {/* <Image src="/logo.png" alt="Logo" width={30} height={30} className="rounded-full" /> */}
              <p className="font-spaceGrotesk font-semibold text-xl">AutoYT</p>
            </a>
          </div>
          
          <p className="text-muted-foreground">
            YouTube Content Creator, powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-[50rem]">

          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground">Quick Links</h3>
            <nav>
              <ul className="flex flex-col gap-3">
                {otherLinks.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href}
                      className="font-medium hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>


          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground">Legal</h3>
            <nav>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href}
                      className="font-medium hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <p className="text-center text-muted-foreground sm:text-left">
        © {new Date().getFullYear()} <Link href="https://arhanansari.is-a.dev/" target="_blank" className="text-rose-600">Arhan Ansari</Link>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;