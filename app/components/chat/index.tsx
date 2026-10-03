'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const q = queryRef.current
    if (!q || q.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const hasPendingImageUploads = files.some(file => file.progress !== -1 && file.progress < 100)
    const hasPendingAttachmentUploads = attachmentFiles.some(file => file.progress !== -1 && file.progress < 100)
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    onSend(suggestion, [])
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3 sm:px-4', 'h-full flex flex-col')}>
      {/* Chat List */}
      <div className="flex-1 space-y-4 pb-2">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return (
              <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            )
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(fileItem => fileItem.url) : []}
            />
          )
        })}
      </div>

      {/* Modern Input Area & Branded Footer */}
      {!isHideSendInput && (
        <div className="sticky z-10 bottom-0 w-full px-3 sm:px-4 pb-2 bg-gradient-to-t from-white via-white/95 to-transparent pt-2 mt-auto">
          {/* File Upload Preview */}
          {files.length > 0 && (
            <div className="mb-2 pl-4">
              <ImageList
                list={files}
                onRemove={onRemove}
                onReUpload={onReUpload}
                onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                onImageLinkLoadError={onImageLinkLoadError}
              />
            </div>
          )}

          {/* Pill Container */}
          <div className="flex items-center bg-white border border-slate-200/90 focus-within:border-[#0066ff] focus-within:ring-2 focus-within:ring-blue-100 rounded-full shadow-md py-1 px-3 sm:px-4 transition-all duration-150">
            {visionConfig?.enabled && (
              <div className="shrink-0 mr-1.5 flex items-center">
                <ChatImageUploader
                  settings={visionConfig}
                  onUpload={onUpload}
                  disabled={files.length >= visionConfig.number_limits}
                />
              </div>
            )}
            {fileConfig?.enabled && (
              <div className="shrink-0 mr-1.5">
                <FileUploaderInAttachmentWrapper
                  fileConfig={fileConfig}
                  value={attachmentFiles}
                  onChange={setAttachmentFiles}
                />
              </div>
            )}

            {/* Message Input */}
            <Textarea
              className="grow px-2 py-2 leading-relaxed text-sm text-slate-800 placeholder-slate-400 outline-none appearance-none resize-none bg-transparent max-h-[120px]"
              placeholder="Type your message..."
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              autoSize={{ minRows: 1, maxRows: 4 }}
            />

            {/* Circular Blue Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={isResponding || (!query.trim() && files.length === 0 && attachmentFiles.length === 0)}
              className="w-10 h-10 rounded-full bg-[#0066ff] hover:bg-[#0052cc] disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm shrink-0 transition-all duration-150 active:scale-95 ml-1"
              title={t('common.operation.send') || 'Send'}
              aria-label="Send Message"
            >
              <svg className="w-5 h-5 text-white transform rotate-45 -mr-0.5 -mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Branded Footer from Mockup: Powered by Mambo Systems */}
          <div className="flex items-center justify-center space-x-1.5 pt-2 text-[11px] sm:text-xs text-slate-500 font-medium select-none">
            <img
              src="/mambo-logo-transparent-hd.png"
              alt="Mambo Logo"
              className="w-3.5 h-3.5 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/mambo-logo.png'
              }}
            />
            <span>
              Powered by <strong className="text-slate-700 font-semibold">Mambo Systems</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
