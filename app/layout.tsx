import { Layout } from '@/components/dom/Layout'
import { Toaster } from '@/components/ui/Toaster'
import '@/global.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Atlas',
  description: 'Invite players to play a game of Atlas with your friends',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
