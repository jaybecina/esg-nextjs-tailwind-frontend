import { FC, Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

type AutocompleteFieldPropsType = {
  initialValue: string;
  label: string;
  placeholder?: string;
  options: Array<{ value: string, label: string }>
  setValue: (value: string) => void;
}

const AutocompleteField: FC<AutocompleteFieldPropsType> = ({ options, placeholder, initialValue, label, setValue }) => {
  const [selected, setSelected] = useState({ value: "", label: "" })
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? options
      : options.length > 0 && options.filter((person) =>
        person.label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  useEffect(() => {
    setSelected({ value: "", label: "" })
  }, [options])

  useEffect(() => {
    const index = options.findIndex((o) => o.value === initialValue);
    if (index > -1) {
      setSelected(options[index])
    }
  }, [initialValue])

  useEffect(() => {
    if (selected) {
      setValue(selected.value)
    }
  }, [selected])

  return (
    <div className="w-full">
      <p className="text-xs font-medium mb-1 text-jll-gray-dark">{label}</p>
      <Combobox
        value={selected}
        onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 text-xs font-medium mb-1 text-jll-gray-dark border border-jll-gray-dark">
            <Combobox.Input
              // disabled={options.length === 0}
              placeholder={placeholder || "Search material"}
              className="w-full border-none disabled:opacity-50 py-[6px] pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(item: any) => item.label}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filtered.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filtered.map((person) => (
                  <Combobox.Option
                    key={person.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-200' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {person.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-500'
                              }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default AutocompleteField;