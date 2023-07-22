import React, { FC, Ref, useState } from 'react'
import Avatar, { IAvatarProps } from './Avatar'
import { PhoneIcon, EnvelopeIcon, ClockIcon, ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import PopupModal from './PopupModal';
import relativeTime from "dayjs/plugin/relativeTime";
import { formatInTimeZone, format } from 'date-fns-tz';
import { formatDistance } from 'date-fns';
import { get } from 'lodash';
import dayjs from 'dayjs';

interface IProps {
  height?: number;
  lastItemRef?: Ref<HTMLDivElement>;
  data: Array<{
    avatar: IAvatarProps;
    text: string;
    phone: string;
    email: string;
    date: Date;
  }>
}

const MessageBox: FC<IProps> = (props) => {

  const { lastItemRef } = props;
  const data = get(props, "data", [])
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  function hideTodoModal() {
    setModalIsVisible(false)
  }

  function getLastUpdateTime() {
    const latestItemCreatedAt = data.length > 0 && data[0].date;
    dayjs.extend(relativeTime);

    return dayjs(latestItemCreatedAt).fromNow();
  }

  return (
    <>
      <PopupModal
        position="center"
        isVisible={modalIsVisible}
        onClose={hideTodoModal}>
        <div className="relative p-5 rounded border shadow-lg bg-white w-[700px]">
          <p className="text-center text-3xl">Filled Record</p>
          <div className="p-5 max-h-[420px] overflow-y-scroll my-5">
            {data && data.length > 0 && data.map((item, index: number) => (
              <div
                key={index}
                className="flex justify-start items-start gap-2 px-3">
                <div className="">
                  <Avatar {...item.avatar} />
                </div>
                <div className="border-b pb-2 mb-2 border-gray-300">
                  <p className="text-sm">{item.text}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-jll-gray-dark">
                    <div className="flex gap-2 items-center">
                      <PhoneIcon className="w-4 h-4" />
                      <p>{item.phone}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <EnvelopeIcon className="w-4 h-4" />
                      <p>{item.email}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ClockIcon className="w-4 h-4" />
                      <p>{format(item.date, "d MMMM, yyyy p").toString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={hideTodoModal}
              className="text-sm text-white px-5 bg-jll-gray py-1"
              type="button">
              Cancel
            </button>
          </div>
        </div>
      </PopupModal>

      <div className="border h-full shadow-lg border-jll-gray overflow-hidden flex flex-col justify-between bg-white rounded-md w-[320px]">
        <div className="flex justify-between items-center px-3 py-2">
          <p className="font-semibold text-lg">Filled Record</p>
          {props.data && props.data.length > 0 && (
            <button
              onClick={() => setModalIsVisible(true)}
              type="button"
              className="text-sm border border-jll-red rounded-full px-2">
              See All
            </button>
          )}
        </div>

        <div className="flex-grow flex-col items-center justify-start overflow-y-auto bg-gray-50">
          {data && data.length > 0 ? data.map((item, index: number) => {
            if (data.length === index + 1) {
              return (
                <div key={index} ref={lastItemRef}>
                  <NotifItem item={item} />
                </div>
              )
            } else {
              return <NotifItem key={index} item={item} />
            }
          }) : (
            <div className="opacity-20 flex items-center justify-center h-full w-full gap-2">
              <PencilSquareIcon className="w-12 h-12" />
              <p className="font-semibold text-sm whitespace-pre">{`Not working yet, waiting for\n your data to update.`}</p>
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="flex justify-end px-3 py-2">
            <button
              className="text-sm flex gap-1 text-jll-gray-dark items-center"
              type="button">
              <ArrowPathIcon className="w-4 h-4" />
              <span>{getLastUpdateTime()}</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const NotifItem: FC<{ item: any }> = ({ item }) => {
  return (
    <div className="flex justify-start items-start gap-2 px-3 mt-2">
      <div className="flex-grow mt-2">
        <Avatar {...item.avatar} />
      </div>
      <div className="border-b border-gray-300 pb-2">
        <p className="text-sm">{item.text}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-jll-gray-dark mt-2">
          <div className="flex gap-2 items-center">
            <PhoneIcon className="w-4 h-4" />
            <p>{item.phone}</p>
          </div>
          <div className="flex gap-2 items-center">
            <EnvelopeIcon className="w-4 h-4" />
            <p>{item.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <ClockIcon className="w-4 h-4" />
            <p>{format(item.date, "d MMMM, yyyy p", { timeZone: "+08:00" }).toString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBox