// src/vite-env.d.ts  (or src/svg.d.ts)
/// <reference types="vite/client" />

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement>
  >
  const src: string
  export default src
}
