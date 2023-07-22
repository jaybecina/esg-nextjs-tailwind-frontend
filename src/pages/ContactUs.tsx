import { FC, useState } from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid"
import { NewspaperIcon } from "@heroicons/react/24/outline"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import Accordion from '../components/Accordion'
import cx from "classnames";
import { useGetContents } from '../hooks/content'
import { get } from 'lodash'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from "draft-js-export-html"
import { useTranslation } from "react-i18next"

interface IProps { }

const ContactUs: FC<IProps> = (props) => {

  const [schedVisible, setSchedVisible] = useState<boolean>(false);
  const { t } = useTranslation()
  const getContents = useGetContents();
  const faqs = get(getContents, "data.data", []).filter((d: any) => d.category === "faq");
  const index = get(getContents, "data.data", []).findIndex((d: any) => d.title === "contact-us-content");

  function getValue(field: string) {
    let text: string;

    const data = get(getContents, `data.data[${index}]`, {});
    if (data && data.customFields) {
      text = data.customFields[field];
    }

    return t(text);
  }

  function parseContent(field: string) {
    const contents = get(getContents, "data.data", []);
    const index = contents.findIndex((item) => item.title.toLowerCase() === field.toLowerCase());

    if (index >= 0) {
      const data = convertFromRaw(JSON.parse(contents[index].content))
      if (field === "email") {
      }
      return <div dangerouslySetInnerHTML={{ __html: stateToHTML(data) }} />
    }

    return null;
  }

  if (getContents.isLoading) {
    return (
      <div className="p-5">Loading...</div>
    )
  }

  return (
    <main className="p-5">
      <p className="text-3xl font-bold mb-3">{t("Service Center")}</p>
      <div className="flex gap-1 items-center justify-start">
        <img
          loading="lazy"
          alt="cs-icon"
          src="/assets/cs-icon.png" />
        <p
          data-cy="contact-title"
          className="text-xl font-semibold">{getValue("title")}</p>
      </div>
      <div className="pl-5">
        <p
          data-cy="contact-text"
          className="text-jll-gray-dark text-sm">{getValue("text")}</p>

        <div className="w-fit">
          <div className={cx("flex text-sm items-center justify-start gap-1 mt-3", {
            "hidden": schedVisible
          })}>
            {parseContent("hours-collapsed")}
            <button
              type="button"
              onClick={() => setSchedVisible(true)}>
              <FontAwesomeIcon icon={faCaretDown} />
            </button>
          </div>

          <div className={cx("w-fit mt-3 ml-auto text-sm", {
            "hidden": !schedVisible
          })}>
            <div className="flex items-start gap-1 mb-2">
              <p className="font-bold">{t("Hours")}:</p>
              <div className="flex-grow">
                {parseContent("hours-visible")}
              </div>
              <button
                type="button"
                onClick={() => setSchedVisible(false)}>
                <FontAwesomeIcon icon={faCaretUp} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex text-sm gap-5 items-center justify-start mt-1">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            <p data-cy="contact-phone">{getValue("phone")}</p>
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" />
            <p data-cy="contact-email">{getValue("email")}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <p data-cy="contact-address">{getValue("address")}</p>
          </div>
        </div>
      </div>

      <hr className="bg-jll-gray my-3 h-[2px]" />

      <div className="flex gap-1 items-center justify-start mt-10">
        <NewspaperIcon className="w-5 h-5" />
        <p className="text-xl font-semibold">{t("FAQ's")}</p>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {faqs && faqs.length > 0 ? faqs.map((content: any) => (
          <Accordion
            id={content._id}
            key={content._id}
            title={content.title}
            body={content.content}
          />
        )) : null}
      </div>

    </main>
  )
}

export default ContactUs