'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  return (
    <div className="flex items-start justify-end gap-2 my-2" key={id}>
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div className="relative text-sm text-white font-normal">
          <div className="py-2.5 px-3.5 sm:py-3 sm:px-4 bg-[#0066ff] rounded-2xl rounded-tr-xs shadow-xs text-white">
            {imgSrcs && imgSrcs.length > 0 && (
              <div className="mb-2">
                <ImageGallery srcs={imgSrcs} />
              </div>
            )}
            <div className="prose prose-invert max-w-none text-white text-[13px] sm:text-[14px] leading-relaxed [&>p]:my-0 select-text">
              <StreamdownMarkdown content={content} />
            </div>
          </div>
        </div>
      </div>
      {useCurrentUserAvatar ? (
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-xs shadow-xs mt-0.5">
          U
        </div>
      ) : (
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-semibold text-xs shadow-xs mt-0.5">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default React.memo(Question)
