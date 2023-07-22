import { useState } from 'react'
import { InformationCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from '../components/Button'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowDownLeftIcon } from "@heroicons/react/24/solid"
import PopupModal from '../components/PopupModal';
import LargeStaticWidget from '../components/LargeStaticWidget';
import MessageBar from '../components/MessageBar';
import TextField from '../components/TextField';
import { useAlertBox } from '../hooks/alertBox';
import SmallStaticWidget from '../components/SmallStaticWidget';
import LargeDynamicWidget from '../components/LargeDynamicWidget';
import SmallDynamicWidget from '../components/SmallDynamicWidget';
import StatisticBar from '../components/StatisticBar';
import InfoBar from '../components/InfoBar';
import Accordion from '../components/Accordion';
import MessageBox from '../components/MessageBox';
import TodoList from '../components/TodoList';
import SelectField from '../components/SelectField';
import MeterInputBox from '../components/MeterInputBox';
import Table from '../components/Table';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DeleteModal from '../components/DeleteModal';
import AddMaterialModal from '../components/materialList/AddMaterialModal';
import { MODAL_MODE } from '../types/modal';
import FormBuilderMeterItem from '../components/FormBuilderMeterItem';
import TestApp from '../components/materialList/test';
import MaterialCalculationForm from '../components/materialList/MaterialCalculationForm';
import { Formik } from 'formik';
import Dnd from '../components/materialList/dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Dnd2 from '../components/materialList/dnd2';

const lineChartData = [
  {
    name: "1",
    percentage: 79
  },
  {
    name: "2",
    percentage: 20
  },
  {
    name: "3",
    percentage: 24
  },
  {
    name: "4",
    percentage: 79
  },
  {
    name: "5",
    percentage: 30
  },
  {
    name: "6",
    percentage: 12
  },
  {
    name: "7",
    percentage: 76
  },
  {
    name: "8",
    percentage: 23
  },
  {
    name: "9",
    percentage: 30
  },
  {
    name: "10",
    percentage: 55
  },
  {
    name: "11",
    percentage: 45
  },
  {
    name: "12",
    percentage: 29
  },
  {
    name: "13",
    percentage: 100
  },
];

const barChartData = [
  { date: "2021.4", value: 200 },
  { date: "2021.5", value: 350 },
  { date: "2021.6", value: 520 },
  { date: "2021.7", value: 269 },
  { date: "2021.8", value: 497 },
  { date: "2021.9", value: 448 },
  { date: "2021.10", value: 714 },
  { date: "2021.11", value: 875 },
  { date: "2021.12", value: 501 },
  { date: "2022.1", value: 474 },
  { date: "2022.2", value: 836 },
]

export const DUMMY_FORM_ITEM_DATA = [
  {
    "_id": "6371e3ffdc03fb556cacbfcf",
    "name": "Nvidia graphics 4090 Consumptions",
    "uniqueId": "nvidia-graphics-4090-consumptions",
    "size": 6,
    "type": "text",
    "content": [
      {
        "question": "question 1",
        "hints": "hint 1"
      },
      {
        "question": "question 2",
        "hints": "hint 2"
      }
    ],
    "version": 1,
    "latest": true,
    "__v": 0
  },
  {
    "_id": "6371d4bfdc03fb556cacbf59",
    "name": "Laptop Consumption",
    "uniqueId": "laptop-consumption",
    "size": 5,
    "type": "matrix",
    "content": [
      {
        "rows": [
          { "name": "Custom Row 1" },
          { "name": "Dynamic Row 2" },
          { "name": "Long name Row 3" },
          { "name": "Short name Row 4" },
        ],
        "columns": [
          {
            "name": "Distance",
            "inputType": "number",
            "outputUnit": "miles"
          },
          {
            "name": "Cost",
            "inputType": "number",
            "outputUnit": "pounds"
          },
          {
            "name": "Weight",
            "inputType": "text",
            "outputUnit": "lbs"
          }
        ]
      }
    ],
    "version": 1,
    "latest": true,
    "__v": 0
  },
]
const Preview = () => {

  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>("")
  const [select, setSelect] = useState<string>("");
  const alertBox = useAlertBox()

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  return (
    <div
      className="p-5 mt-10">

      {/* <Formik
        enableReinitialize
        initialValues={{
          name: "",
          uniqueId: "",
          unit: "",
          type: "calculation",
          expression: []
        }}
        onSubmit={(values) => console.log({ values}) }>
        {() => {
          return (
            <div className="w-1/2">
              <MaterialCalculationForm />
            </div>
          )
        }}
        </Formik> */}

      <hr />
      
      {/* <DndProvider backend={HTML5Backend}> */}
        {/* <Dnd /> */}
        <Dnd2 />
      {/* </DndProvider> */}

      {/* <TestApp /> */}

      <div className="w-[520px] p-5 rounded-md">

      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 border-r">
          {/* <code className="whitespace-pre">{JSON.stringify(data, null, 2)}</code> */}
        </div>
        <div className="col-span-8">

          <p>FORM START</p>
          {/* 
          <FormBuilderMeterItem
            name="hello world"
            handleEditClick={() => { }}
            data={DUMMY_FORM_ITEM_DATA}
          /> */}

        </div>
      </div>

      <hr />

      {/* <AddMaterialModal
        mode={ModalMode.create}
        closeModal={() => { }}
        isVisible={true}
        onConfirm={() => { }}
        values={{}} /> */}

      <button
        onClick={() => setDeleteModalVisible(true)}
        data-cy="delete-modal-btn"
        className="mt-[5rem]"
        type="button">
        Delete Modal
      </button>

      <DeleteModal
        loading={false}
        title="Delete Modal"
        isVisible={deleteModalVisible}
        label="XYZ Company Item 1"
        closeModal={() => setDeleteModalVisible(false)}
        onConfirm={() => setDeleteModalVisible(false)}
      />

      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(state: EditorState) => setEditorState(state)}
        toolbar={{
          options: ['inline', 'list', 'textAlign'],
        }} />

      <div className="w-[720px]">
        <BarChart data={barChartData} />
      </div>
      <br />
      <div className="w-[1200px]">
        <LineChart data={lineChartData} />
      </div>

      <hr className="my-5" />

      <div className="p-5 flex gap-5">
        <Button
          type="lg"
          variant="gradient">
          Download
        </Button>
        <Button
          type="lg"
          variant="solid">
          Download
        </Button>
        <Button
          type="lg"
          variant="outlined">
          Download
        </Button>
      </div>

      <div className="px-5 flex gap-5">
        <Button
          type="sm"
          variant="gradient">
          Download
        </Button>
        <Button
          type="sm"
          variant="solid">
          Download
        </Button>
        <Button
          type="sm"
          variant="outlined">
          Download
        </Button>
      </div>

      <div className="p-5 flex gap-5">
        <Button
          type="icon"
          variant="gradient">
          <ArrowDownLeftIcon className="w-5 h-5 mr-1" />
          Download
        </Button>
        <Button
          type="icon"
          variant="solid">
          <ArrowDownLeftIcon className="w-5 h-5 mr-1" />
          Download
        </Button>
        <Button
          type="icon"
          variant="outlined">
          <ArrowDownLeftIcon className="w-5 h-5 mr-1" />
          Download
        </Button>
      </div>

      <hr className="mb-5" />

      <button
        onClick={() => setVisible(!visible)}
        className="border px-3"
        data-cy="preview-show-modal-btn"
        type="button">Show Modal</button>

      <div className="flex flex-col gap-5 relative p-5 rounded-lg mt-5 border shadow-lg bg-white w-[700px] h-fit">
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-2"
          type="button">
          <XMarkIcon className="w-5 h-6" />
        </button>
        <p className="text-3xl font-semibold text-center">h3</p>
        <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id commodo sem orci sit magna diam accumsan, sed. Adipiscing ante a id a nibh libero in. Mauris tristique id sed porta sagittis, elit ante enim praesent. Pharetra diam tristique ac, curabitur blandit malesuada consectetur.</p>
        <div className="flex justify-center gap-3 items-center">
          <Button
            type="sm"
            variant="gradient">
            <span className="px-1">Confirm</span>
          </Button>
          <Button
            type="sm"
            variant="outlined">
            <span className="px-2">Cancel</span>
          </Button>
        </div>
      </div>

      <PopupModal
        onClose={() => setVisible(false)}
        isVisible={visible}>
        <div
          data-cy="preview-show-modal"
          className="flex flex-col gap-5 relative p-5 rounded-lg mt-10 border shadow-lg bg-white w-[700px] h-fit">
          <button
            data-cy="preview-modal-close-btn"
            onClick={() => setVisible(false)}
            className="absolute right-4 top-2"
            type="button">
            <XMarkIcon className="w-5 h-6" />
          </button>
          <p className="text-3xl font-semibold text-center">h3</p>
          <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id commodo sem orci sit magna diam accumsan, sed. Adipiscing ante a id a nibh libero in. Mauris tristique id sed porta sagittis, elit ante enim praesent. Pharetra diam tristique ac, curabitur blandit malesuada consectetur.</p>
          <div className="flex justify-center gap-3 items-center">
            <Button
              type="sm"
              dataCy="jll-btn-confirm-modal"
              variant="gradient">
              <span className="px-1">Confirm</span>
            </Button>
            <Button
              type="sm"
              dataCy="jll-btn-cancel-modal"
              variant="outlined">
              <span className="px-2">Cancel</span>
            </Button>
          </div>
        </div>
      </PopupModal>

      <hr className="my-5" />

      <div className="flex gap-3">
        <LargeStaticWidget
          label="User List"
          text="Let's start to check Forms."
          href=""
          image="/assets/laptop.png"
          alternativeText="laptop-data-img"
          color="orange"
        />
        <LargeStaticWidget
          label="User Feedback"
          text="Create a better user experience for the platform"
          href=""
          image="/assets/questionnaire.png"
          alternativeText="laptop-data-img"
          color=""
        />
      </div>

      <hr className="my-5" />

      <div className="flex flex-col gap-3 w-1/3">
        <div className="p-2 rounded">{JSON.stringify(text)}</div>

        <TextField
          label="Sample Input"
          value={text}
          onChange={setText}
          required
          type="text"
          placeholder="Enter text..."
        />
        <TextField
          label="Sample Input with Error"
          value={text}
          onChange={setText}
          type="text"
          placeholder="Enter text..."
          error={Boolean(!text)}
          errorMessage="Text is required"
        />
        <SelectField
          label="Unit"
          value={select}
          required
          name=""
          onSelect={() => setSelect("")}
          options={[
            { value: "1", label: "one" },
            { value: "2", label: "two" },
            { value: "3", label: "three" }
          ]}
        />
      </div>

      <hr className="my-5" />

      <div className="border rounded-lg p-5">

        <p className="whitespace-pre mb-5">{JSON.stringify(alertBox, null, 2)}</p>

        <button
          type="button"
          data-cy="show-alert-btn"
          className="px-2 border rounded"
          onClick={() => alertBox.show({
            title: "This is an alert",
            description: "Alert details go here",
            type: "success"
          })}
        >
          Show Alert
        </button>
        <hr className="mt-5" />

        <div className="flex gap-5">
          <main className="min-h-[58px] w-[320px] bg-white p-2 mt-5 right-0 rounded-lg shadow-md items-center justify-start gap-3 flex z-20">
            <InformationCircleIcon className="w-8 h-8 text-jll-orange Waring" />
            <div>
              <p className="font-semibold text-lg">This is an alert WARNING</p>
              <p className="">Alert details goes here....</p>
            </div>
          </main>
          <main className="min-h-[58px] w-[320px] bg-white p-2 mt-5 right-0 rounded-lg shadow-md items-center justify-start gap-3 flex z-20">
            <CheckCircleIcon className="w-8 h-8 text-jll-green" />
            <div>
              <p className="font-semibold text-lg">This is an alert SUCCESS</p>
              <p className="">Alert details goes here....</p>
            </div>
          </main>
          <main className="min-h-[58px] w-[320px] bg-white p-2 mt-5 right-0 rounded-lg shadow-md items-center justify-start gap-3 flex z-20">
            <ExclamationCircleIcon className="w-8 h-8 text-jll-red-light" />
            <div>
              <p className="font-semibold text-lg">This is an alert ERROR</p>
              <p className="">Alert details goes here....</p>
            </div>
          </main>
        </div>
      </div>

      <hr className="mt-5" />

      <div className="my-5 flex gap-5 items-start">
        <SmallStaticWidget
          label='Add User'
          description='description hello'
        />

        <LargeDynamicWidget
          date={new Date()}
          label="Check Report"
          progress={63}
          totalProgress={95}
          dayLeft={2}
        />

        <div className="flex flex-col gap-3">
          <SmallDynamicWidget
            label="In Progress Report"
            value="1,026"
            increasedBy={29}
          />
          <SmallDynamicWidget
            label="In Progress Report"
            value="221"
            increasedBy={-54}
          />
        </div>
      </div>

      <hr className="my-5" />

      <div className="my-5 flex flex-col gap-4">

        <MessageBar
          type="news"
          title="We have added a new function to the system. Now you can learn more about the industry in the news section of the homepage. Come and have a look."
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet sit elementum duis vel diam. Sagittis luctus laoreet mus diam suspendisse duis facilisis pulvinar. Eget donec viverra quam urna mi, tortor aliquet nisl. Ullamcorper facilisi semper nunc varius at bibendum proin. Etiam habitant tincidunt in porta et sed porttitor commodo pellentesque. "
        />
        <MessageBar
          type="remind"
          title=" The A1 FORM data has some errors, please check it again."
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet sit elementum duis vel diam. Sagittis luctus laoreet mus diam suspendisse duis facilisis pulvinar. Eget donec viverra quam urna mi, tortor aliquet nisl. Ullamcorper facilisi semper nunc varius at bibendum proin. Etiam habitant tincidunt in porta et sed porttitor commodo pellentesque. "
        />

        <StatisticBar
          label="Actual Total Electricity Consumption Per Month"
          data={[
            { date: "April 2021", value: 350 },
            { date: "May 2021", value: 350 },
            { date: "June 2021", value: 350 },
            { date: "July 2021", value: 350 },
            { date: "August 2021", value: 350 },
            { date: "September 2021", value: 350 },
            { date: "October 2021", value: 350 },
            { date: "November 2021", value: 350 },
            { date: "December 2021", value: 350 },
            { date: "January 2022", value: 350 },
            { date: "February 2022", value: 350 },
            { date: "March 2022", value: 350 },
          ]} />

      </div>

      {/* <hr className="my-5" />

      <div className="flex flex-col gap-2">
        <Accordion
          title="How to fill in the contents of the A1 form correctly?"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet sit elementum duis vel diam. Sagittis luctus laoreet mus diam suspendisse duis facilisis pulvinar. Eget donec viverra quam urna mi, tortor aliquet nisl. Ullamcorper facilisi semper nunc varius at bibendum proin. Etiam habitant tincidunt in porta et sed porttitor commodo pellentesque. Sit vivamus nisi magna mauris fames platea vehicula. Pellentesque nisi, ac nisi id risus tincidunt lacinia et. Nam cursus nunc felis sed venenatis purus arcu. Placerat habitasse dui libero congue. Vel est leo volutpat nibh vehicula blandit. Vel erat eget cursus commodo feugiat nisl lorem. Enim dui, accumsan orci, massa sit ultrices. Faucibus vitae massa suscipit cras. Est tempus, habitasse odio odio pretium non volutpat odio pretium."
        />
        <Accordion
          title="How do we evaludate data?"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet sit elementum duis vel diam. Sagittis luctus laoreet mus diam suspendisse duis facilisis pulvinar. Eget donec viverra quam urna mi, tortor aliquet nisl. Ullamcorper facilisi semper nunc varius at bibendum proin. Etiam habitant tincidunt in porta et sed porttitor commodo pellentesque."
        />
      </div> */}

      <hr className="my-5" />

      <div className="flex gap-5">
        <MessageBox data={[]} />
        <MessageBox
          data={[
            {
              avatar: { url: "", alternativeText: "", size: "sm" },
              text: "Matt Leung, from Company Name, Company Name Brach B, Responsible Area is Meter 1.",
              phone: "87459066",
              email: "example@client.com",
              date: new Date()
            },
            {
              avatar: { url: "", alternativeText: "", size: "sm" },
              text: "Matt Leung, from Company Name, Company Name Brach B, Responsible Area is Meter 1.",
              phone: "87459066",
              email: "example@client.com",
              date: new Date()
            },
            {
              avatar: { url: "", alternativeText: "", size: "sm" },
              text: "Matt Leung, from Company Name, Company Name Brach B, Responsible Area is Meter 1.",
              phone: "87459066",
              email: "example@client.com",
              date: new Date()
            },
            {
              avatar: { url: "", alternativeText: "", size: "sm" },
              text: "Matt Leung, from Company Name, Company Name Brach B, Responsible Area is Meter 1.",
              phone: "87459066",
              email: "example@client.com",
              date: new Date()
            },
          ]}
        />

        <TodoList data={[]} />
        <TodoList
          data={[
            { todo: "Meter 1 not finish electricity consumption form", completed: false },
            { todo: "Meter 2 is missing data, it was not fill in January electricity consumption. Please mark 0',  'Nil' or 'Not applicable' if not applicable, and explain the reason.", completed: false },
            { todo: "Meter 3 not finish electricity consumption form", completed: false },
            { todo: "Meter 5 not finish electricity consumption form", completed: false },
            { todo: "Meter 2 is missing data, it was not fill in January electricity consumption. Please mark 0',  'Nil' or 'Not applicable' if not applicable, and explain the reason.", completed: false }
          ]}
        />
      </div>

      <hr className="my-5" />

      <MeterInputBox item={{ meter: 1, name: "hello" }} />

      <hr className="my-5" />

      {/* <Table
        // // pageCount={4}
        // currentPage={4}
        // handlePageClick={() => { }}
        header={["ID", "Company Name", "Business Owner", "Contact", "Role", "User Complete Schedule", "Last Update Time", "Date of Expiry", "Admin Check Progress", ""]}
        data={[
          {
            id: 1,
            name: "XXX limited Company",
            owner: "Kelly Yeung",
            phone: "654321",
            email: "example@ap.jll.com",
            role: "Project Manager",
            userCompleteSchedule: {
              progress: 55,
              totalProgress: 120
            },
            lastUpdatedTime: new Date(),
            dateOfExpiry: new Date(),
            adminCheckProgress: {
              progress: 55,
              totalProgress: 67
            }
          },
          {
            id: 2,
            name: "XXX limited Company",
            owner: "Kelly Yeung",
            phone: "654321",
            email: "example@ap.jll.com",
            role: "Project Manager",
            userCompleteSchedule: {
              progress: 55,
              totalProgress: 67
            },
            lastUpdatedTime: new Date(),
            dateOfExpiry: new Date(),
            adminCheckProgress: {
              progress: 55,
              totalProgress: 67
            }
          },
          {
            id: 3,
            name: "XXX limited Company",
            owner: "Kelly Yeung",
            phone: "654321",
            email: "example@ap.jll.com",
            role: "Project Manager",
            userCompleteSchedule: {
              progress: 12,
              totalProgress: 88
            },
            lastUpdatedTime: new Date(),
            dateOfExpiry: new Date(),
            adminCheckProgress: {
              progress: 25,
              totalProgress: 75
            }
          },
        ]}
      /> */}
    </div>
  )
}

export default Preview