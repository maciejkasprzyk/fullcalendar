import { firstDefined } from './util/misc'
import { globalDefaults, mergeOptions } from './options'
import { organizeRawLocales, buildLocale } from './datelib/locale'
import { __assign } from 'tslib'


export default class OptionsManager {

  localeDefaults: any // option defaults related to current locale
  overrides: any // option overrides given to the fullCalendar constructor
  dynamicOverrides: any // options set with dynamic setter method. higher precedence than view overrides.
  computed: any


  constructor(overrides) {
    this.overrides = { ...overrides } // make a copy
    this.dynamicOverrides = {}
    this.compute()
  }


  mutate(updates, removals: string[], isDynamic?: boolean) {

    if (!Object.keys(updates).length && !removals.length) {
      return
    }

    let overrideHash = isDynamic ? this.dynamicOverrides : this.overrides

    __assign(overrideHash, updates)

    for (let propName of removals) {
      delete overrideHash[propName]
    }

    this.compute()
  }


  // Computes the flattened options hash for the calendar and assigns to `this.options`.
  // Assumes this.overrides and this.dynamicOverrides have already been initialized.
  compute() {

    // TODO: not a very efficient system
    let locales = firstDefined( // explicit locale option given?
      this.dynamicOverrides.locales,
      this.overrides.locales,
      globalDefaults.locales
    )
    let locale = firstDefined( // explicit locales option given?
      this.dynamicOverrides.locale,
      this.overrides.locale,
      globalDefaults.locale
    )
    let available = organizeRawLocales(locales) // also done in Calendar :(
    let localeDefaults = buildLocale(locale || available.defaultCode, available.map).options

    this.localeDefaults = localeDefaults

    this.computed = mergeOptions([ // merge defaults and overrides. lowest to highest precedence
      globalDefaults, // global defaults
      localeDefaults,
      this.overrides,
      this.dynamicOverrides
    ])
  }

}
