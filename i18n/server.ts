import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = async (): Promise<Locale> => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] | undefined
  try {
    const localeCookie = (await cookies()).get('locale')
    languages = localeCookie?.value ? [localeCookie.value] : []

    if (!languages.length) {
      const negotiatorHeaders: Record<string, string> = {}
      ;(await headers()).forEach((value, key) => (negotiatorHeaders[key] = value))
      languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    }
  } catch {
    return i18n.defaultLocale as Locale
  }

  try {
    return match(languages, locales, i18n.defaultLocale) as Locale
  } catch {
    return i18n.defaultLocale as Locale
  }
}
