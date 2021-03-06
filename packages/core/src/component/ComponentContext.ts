import Calendar from '../Calendar'
import { ResizeHandler } from '../Calendar'
import ViewApi from '../ViewApi'
import Theme from '../theme/Theme'
import { DateEnv } from '../datelib/env'
import { parseFieldSpecs } from '../util/misc'
import { createDuration, Duration } from '../datelib/duration'
import { PluginHooks } from '../plugin-system'
import { createContext } from '../vdom'
import { parseToolbars, ToolbarModel } from '../toolbar-parse'
import ScrollResponder, { ScrollRequestHandler } from '../ScrollResponder'


export const ComponentContextType = createContext<ComponentContext>({} as any) // for Components


export default interface ComponentContext {
  calendar: Calendar
  pluginHooks: PluginHooks
  dateEnv: DateEnv
  theme: Theme
  view: ViewApi
  options: any
  isRtl: boolean
  eventOrderSpecs: any
  nextDayThreshold: Duration
  headerToolbar: ToolbarModel | null
  footerToolbar: ToolbarModel | null
  viewsWithButtons: string[]
  addResizeHandler: (handler: ResizeHandler) => void
  removeResizeHandler: (handler: ResizeHandler) => void
  createScrollResponder: (execFunc: ScrollRequestHandler) => ScrollResponder
}


export function buildContext(
  calendar: Calendar,
  pluginHooks: PluginHooks,
  dateEnv: DateEnv,
  theme: Theme,
  view: ViewApi,
  options: any
): ComponentContext {
  return {
    calendar,
    pluginHooks,
    dateEnv,
    theme,
    view,
    options,
    ...computeContextProps(options, theme, calendar),
    addResizeHandler: calendar.addResizeHandler,
    removeResizeHandler: calendar.removeResizeHandler,
    createScrollResponder(execFunc: ScrollRequestHandler) {
      return new ScrollResponder(calendar, execFunc)
    }
  }
}


function computeContextProps(options: any, theme: Theme, calendar: Calendar) {
  let isRtl = options.direction === 'rtl'

  return {
    isRtl,
    eventOrderSpecs: parseFieldSpecs(options.eventOrder),
    nextDayThreshold: createDuration(options.nextDayThreshold),
    ...parseToolbars(options, theme, isRtl, calendar)
  }
}
