'use client'
import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'

export interface IHeaderProps {
  title?: string
  subtitle?: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  onMinimize?: () => void
  onClose?: () => void
}

const Header: FC<IHeaderProps> = ({
  title = 'Mambo Systems & Analytics',
  subtitle = 'Web · AI · Automation',
  isMobile,
  onShowSideBar,
  onCreateNewChat,
  onMinimize,
  onClose,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5 bg-gradient-to-r from-[#0052cc] via-[#084bb8] to-[#0047ba] text-white rounded-t-xl sm:rounded-t-3xl shadow-md select-none">
      {/* Left: Website Logo and Branded Titles */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {onShowSideBar && (
          <button
            type="button"
            className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            onClick={onShowSideBar}
            aria-label="Toggle conversations"
            title="Chat History"
          >
            <Bars3Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
        )}
        <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 shrink-0">
          <img
            src="/mambo-logo-transparent-hd.png"
            alt="Mambo Systems Logo"
            className="h-7 sm:h-9 w-auto object-contain drop-shadow"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/mambo-logo.png'
            }}
          />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <span className="text-[13px] sm:text-[15px] font-bold text-white tracking-tight truncate leading-tight">
            {title}
          </span>
          <span className="text-[10px] sm:text-[11px] text-blue-100/90 font-medium tracking-wide leading-tight mt-0.5 truncate">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: Window Controls & Action Buttons */}
      <div className="flex items-center space-x-0.5 sm:space-x-1.5 shrink-0 ml-1.5">
        {onCreateNewChat && (
          <button
            type="button"
            className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onCreateNewChat}
            title="Start New Chat"
            aria-label="Start New Chat"
          >
            <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </button>
        )}
        {onMinimize && (
          <button
            type="button"
            className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onMinimize}
            aria-label="Minimize"
            title="Minimize"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}
        {onClose && (
          <button
            type="button"
            className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default React.memo(Header)
