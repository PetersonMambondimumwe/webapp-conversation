'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'

function OperationBtn({ innerContent, onClick, className }: { innerContent: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <div
      className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800 ${className ?? ''}`}
      style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick && onClick}
    >
      {innerContent}
    </div>
  )
}

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

const IconWrapper: FC<{ children: React.ReactNode | string }> = ({ children }) => {
  return (
    <div className="rounded-lg h-6 w-6 flex items-center justify-center hover:bg-gray-100">
      {children}
    </div>
  )
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

const DEFAULT_QUICK_ACTIONS = [
  {
    title: 'Websites',
    icon: (
      <svg className="w-4 h-4 text-[#0066ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'AI Chatbots',
    icon: (
      <svg className="w-4 h-4 text-[#0066ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Automation',
    icon: (
      <svg className="w-4 h-4 text-[#0066ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: 'Pricing',
    icon: (
      <svg className="w-4 h-4 text-[#0066ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    title: 'Learn more about Mambo Systems',
    fullWidth: true,
    icon: (
      <svg className="w-4 h-4 text-[#0066ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
]

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [], isOpeningStatement } = item as any
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0
  const { t } = useTranslation()

  const renderFeedbackRating = (rating: MessageRating | undefined) => {
    if (!rating) { return null }
    const isLike = rating === 'like'
    const ratingIconClassname = isLike ? 'text-primary-600 bg-primary-100 hover:bg-primary-200' : 'text-red-600 bg-red-100 hover:bg-red-200'
    return (
      <div className={`box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800 ${ratingIconClassname}`}>
        <RatingIcon isLike={isLike} />
      </div>
    )
  }

  const renderItemOperation = () => {
    const userOperation = () => {
      return feedback?.rating
        ? null
        : (
          <div className="flex gap-1">
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={true} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'like' }) })}
            </Tooltip>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={false} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'dislike' }) })}
            </Tooltip>
          </div>
        )
    }

    return (
      <div className={`${s.itemOperation} flex gap-2`}>
        {userOperation()}
      </div>
    )
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((thoughtItem, index) => (
        <div key={index}>
          {thoughtItem.thought && (
            <StreamdownMarkdown content={thoughtItem.thought} />
          )}
          {!!thoughtItem.tool && (
            <Thought
              thought={thoughtItem}
              allToolIcons={allToolIcons || {}}
              isFinished={!!thoughtItem.observation || !isResponding}
            />
          )}
          {getImgs(thoughtItem.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(thoughtItem.message_files).map(img => img.url)} />
          )}
        </div>
      ))}
    </div>
  )

  // Welcome / Opening Statement text formatting
  const formattedContent = React.useMemo(() => {
    if (isOpeningStatement || item.feedbackDisabled) {
      if (content && content.includes('Welcome to Mambo Systems')) {
        return `**Hi! 👋 Welcome to Mambo Systems & Analytics.**\n\nI can help you learn more about our websites, AI chatbots, automation solutions, pricing, and how we can help your business.\n\nWhat are you looking to build or improve today?`
      }
    }
    return content
  }, [content, isOpeningStatement, item.feedbackDisabled])

  const showQuickActions = isOpeningStatement || item.feedbackDisabled || suggestedQuestions.length > 0

  return (
    <div key={id} className="my-3">
      <div className="flex items-start gap-2.5">
        {/* Robot Avatar from Mockup */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden shadow-xs border border-blue-100/50 bg-[#0066ff] flex items-center justify-center relative">
          <img
            src="/robot-avatar-hd.png"
            alt="Robot Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/robot-avatar.png'
            }}
          />
          {isResponding && (
            <div className={s.typeingIcon}>
              <LoadingAnim type="avatar" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className="max-w-[85%] sm:max-w-[80%] min-w-0">
          <div className="relative text-sm text-slate-800">
            <div className={`py-3.5 px-4 sm:px-5 bg-[#f0f4fa] rounded-2xl rounded-tl-xs border border-slate-100/80 shadow-xs leading-relaxed text-[14px] ${workflowProcess && 'min-w-[320px] sm:min-w-[480px]'}`}>
              {workflowProcess && (
                <WorkflowProcess data={workflowProcess} hideInfo />
              )}
              {isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(thoughtItem => !!thoughtItem.thought || !!thoughtItem.tool).length === 0) : !content) ? (
                <div className="flex items-center justify-center w-6 h-5 py-1">
                  <LoadingAnim type="text" />
                </div>
              ) : isAgentMode ? (
                agentModeAnswer
              ) : (
                <div className="prose prose-slate max-w-none text-slate-800 font-normal leading-relaxed text-[14px] select-text">
                  <StreamdownMarkdown content={formattedContent} />
                </div>
              )}
            </div>

            {/* Quick Action Buttons (Websites, AI Chatbots, Automation, Pricing, Learn more...) */}
            {showQuickActions && (
              <div className="mt-3.5 space-y-2">
                {suggestedQuestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => suggestionClick(suggestion)}
                        className="w-full py-2.5 px-4 bg-white hover:bg-blue-50/60 border border-blue-200/90 hover:border-blue-500 rounded-2xl text-left text-[13px] font-medium text-slate-800 shadow-xs hover:shadow-sm transition-all duration-150 flex items-center space-x-2.5 group"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="truncate">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Top 4 in 2-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DEFAULT_QUICK_ACTIONS.slice(0, 4).map((action, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => suggestionClick(action.title)}
                          className="w-full py-2.5 px-4 bg-white hover:bg-blue-50/60 border border-blue-200/90 hover:border-blue-500 rounded-2xl text-left text-[13px] font-medium text-slate-800 shadow-xs hover:shadow-sm transition-all duration-150 flex items-center space-x-2.5 group"
                        >
                          <span className="shrink-0 group-hover:scale-110 transition-transform">{action.icon}</span>
                          <span className="truncate">{action.title}</span>
                        </button>
                      ))}
                    </div>
                    {/* 5th full-width button */}
                    {DEFAULT_QUICK_ACTIONS[4] && (
                      <button
                        type="button"
                        onClick={() => suggestionClick(DEFAULT_QUICK_ACTIONS[4].title)}
                        className="w-full py-2.5 px-4 bg-white hover:bg-blue-50/60 border border-blue-200/90 hover:border-blue-500 rounded-2xl text-left text-[13px] font-medium text-slate-800 shadow-xs hover:shadow-sm transition-all duration-150 flex items-center space-x-2.5 group"
                      >
                        <span className="shrink-0 group-hover:scale-110 transition-transform">{DEFAULT_QUICK_ACTIONS[4].icon}</span>
                        <span className="truncate">{DEFAULT_QUICK_ACTIONS[4].title}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hover Operations (thumbs up/down) */}
            <div className="absolute top-[-10px] right-[-10px] flex flex-row justify-end gap-1">
              {!feedbackDisabled && !item.feedbackDisabled && renderItemOperation()}
              {!feedbackDisabled && renderFeedbackRating(feedback?.rating)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Answer)
