import { RenderResult, Matcher, SelectorMatcherOptions } from '@testing-library/preact'

export function extend(renderResult: RenderResult) {
  return {
    ...renderResult,
    getFirstByLabelText<E extends HTMLElement>(id: Matcher, options?: SelectorMatcherOptions) {
      return renderResult.getAllByLabelText(id, options)[0] as E
    },
  }
}
