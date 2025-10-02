'use client';

import type { ReactNode } from 'react';

const ASCII_RHOMBUS = String.raw`
                          /\                          
                         /  \                         
                        / /\ \                        
                       / /  \ \                       
                      / / /\ \ \                      
                     / / /  \ \ \                     
                    / / / /\ \ \ \                    
                   / / / /  \ \ \ \                   
                  / /_/ /____\ \_\ \                  
                  \ \ \ \    / / / /                  
                   \ \ \ \  / / / /                   
                    \ \ \ \/ / / /                    
                     \ \ \  / / /                     
                      \ \ \/ / /                      
                       \ \  / /                       
                        \ \/ /                        
                         \  /                         
                          \/                          `;

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex">
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 gap-12">
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ca3af]">
              InstaSlide
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">{title}</h1>
              <p className="text-base text-[#d1d5db]">{subtitle}</p>
              {description ? (
                <p className="text-sm text-[#9ca3af] max-w-sm leading-relaxed">{description}</p>
              ) : null}
            </div>
          </div>
          <div className="max-w-md w-full">{children}</div>
        </div>
        {footer ? <div className="px-8 sm:px-16 lg:px-24 py-6 border-t border-[#111111] text-sm text-[#9ca3af]">{footer}</div> : null}
      </div>
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#0d0d0d] border-l border-[#111111]">
        <pre className="text-emerald-400 text-[12px] sm:text-sm leading-[1.15] tracking-[0.2em]">
{ASCII_RHOMBUS}
        </pre>
      </div>
    </div>
  );
}
