import { defineNuxtPlugin } from '#app'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
  RadioGroup,
  RadioGroupOption,
  Switch,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('MenuButton', MenuButton)
  nuxtApp.vueApp.component('MenuItem', MenuItem)
  nuxtApp.vueApp.component('MenuItems', MenuItems)
  
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('DialogPanel', DialogPanel)
  nuxtApp.vueApp.component('DialogTitle', DialogTitle)
  
  nuxtApp.vueApp.component('Disclosure', Disclosure)
  nuxtApp.vueApp.component('DisclosureButton', DisclosureButton)
  nuxtApp.vueApp.component('DisclosurePanel', DisclosurePanel)
  
  nuxtApp.vueApp.component('Listbox', Listbox)
  nuxtApp.vueApp.component('ListboxButton', ListboxButton)
  nuxtApp.vueApp.component('ListboxLabel', ListboxLabel)
  nuxtApp.vueApp.component('ListboxOption', ListboxOption)
  nuxtApp.vueApp.component('ListboxOptions', ListboxOptions)
  
  nuxtApp.vueApp.component('Popover', Popover)
  nuxtApp.vueApp.component('PopoverButton', PopoverButton)
  nuxtApp.vueApp.component('PopoverPanel', PopoverPanel)
  
  nuxtApp.vueApp.component('RadioGroup', RadioGroup)
  nuxtApp.vueApp.component('RadioGroupOption', RadioGroupOption)
  
  nuxtApp.vueApp.component('Switch', Switch)
  
  nuxtApp.vueApp.component('Tab', Tab)
  nuxtApp.vueApp.component('TabGroup', TabGroup)
  nuxtApp.vueApp.component('TabList', TabList)
  nuxtApp.vueApp.component('TabPanel', TabPanel)
  nuxtApp.vueApp.component('TabPanels', TabPanels)
  
  nuxtApp.vueApp.component('Combobox', Combobox)
  nuxtApp.vueApp.component('ComboboxButton', ComboboxButton)
  nuxtApp.vueApp.component('ComboboxInput', ComboboxInput)
  nuxtApp.vueApp.component('ComboboxOption', ComboboxOption)
  nuxtApp.vueApp.component('ComboboxOptions', ComboboxOptions)
})