"use client"

import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { ChevronDown, Check } from "lucide-react"

const statuses = ["Pending", "Reviewed", "Hired", "Rejected"]

const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  return (
    <Listbox value={currentStatus} onChange={onStatusChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200">
          <span className="block truncate mr-1.5">{currentStatus}</span>
          <ChevronDown 
            className="h-3.5 w-3.5 text-gray-500" 
            aria-hidden="true" 
          />
        </Listbox.Button>

        <Transition 
          as={Fragment}
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 w-full min-w-[120px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg z-[100] border border-gray-200">
            {statuses.map((status) => (
              <Listbox.Option
                key={status}
                className={({ active }) =>
                  `relative cursor-default select-none py-1.5 pl-8 pr-4 ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`
                }
                value={status}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {status}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default StatusDropdown