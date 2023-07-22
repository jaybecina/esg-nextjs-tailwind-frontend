import React, { FC, useState } from 'react'
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import { stateToHTML } from "draft-js-export-html"
import { convertFromRaw } from 'draft-js';
import { useTranslation } from "react-i18next"

interface IProps {
  id?: string;
  title: string;
  body: any;
  isOpen?: boolean;
}

const Accordion: FC<IProps> = (props) => {

  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen || false)
  const body = convertFromRaw(JSON.parse(props.body));

  return (
    <div>
      <button
        type="button"
        data-cy="accordion-title-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-2 items-center justify-start">
        {isOpen
          ? <MinusIcon className="h-5 w-5 text-jll-red" />
          : <PlusIcon className="h-5 w-5 text-jll-red" />}
        <p
          data-cy={`faq-${props.id}-title`}
          className="font-semibold">{t(props.title)}</p>
      </button>
      {isOpen ? (
        <div
          data-cy="faq-answer-container"
          className="px-3 ml-5 my-3 border-l-2 text-jll-gray-dark text-sm border-red-400 max-w-[720px] text-justify">
          <div dangerouslySetInnerHTML={{ __html: stateToHTML(body) }} />
        </div>
      ) : null}
    </div>
  )
}

export default Accordion