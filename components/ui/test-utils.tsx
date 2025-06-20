import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement } from "react"

// Custom render function for component testing
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => render(ui, { ...options })

export * from "@testing-library/react"
export { customRender as render }
