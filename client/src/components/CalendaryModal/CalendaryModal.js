import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import style from "./CalendaryModal.module.css";
// import Datetime from 'react-datetime';

import moment from "moment";
import { DateTimePicker } from "@material-ui/pickers";

import { NavLink, useParams, Redirect } from "react-router-dom";
import { createDate } from "../../redux/Calendar/actions";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    padding: "40px",
    inset: "unset",
    width: "100%",
    borderRadius: "8px",
    maxWidth: "650px",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "grid",
    placeItems: "center",
    zIndex: "1000",
  },
};

function CalendaryModal({ ModalOpen, setModalOpen }) {
  const dispatch = useDispatch();

  const { projectId: projectParams } = useParams();

  const [data, setData] = useState({
    title: "",
    start: "",
    end: "",
    projectId: projectParams,
  });

  function changeHandler(e) {
    if (e.target.name === "title") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
      return;
    }
    console.log("target value", e.target.value);
    let value = moment(e.target.value);
    console.log("value", value);
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log("value", data);
  }

  const projectId = useSelector((state) => state.managerView.project._id);

  const submitHandler = (e) => {
    e.preventDefault();

    // onEventAdded({
    //   title,
    //   start,
    //   end
    // })
    setModalOpen(false);
    console.log("dispachacion de fecha");
    dispatch(createDate(data));
  };

  function changeDate(date, type) {
    setData({
      ...data,
      [type]: new Date(date._d),
    });
  }

  if (!projectId) {
    return <Redirect to={`/project/${projectParams}`} />;
  }

  return (
    <Modal
      style={customStyles}
      isOpen={ModalOpen}
      onRequestClose={() => setModalOpen(false)}
    >
      <form onSubmit={submitHandler}>
        <input
          placeholder="Title"
          value={data.title}
          name="title"
          onChange={(e) => changeHandler(e)}
        />
        <div>
          <h4>Start Date</h4>
          <DateTimePicker
            value={data.start}
            onChange={(date) => changeDate(date, "start")}
          />
          {/* <Datetime value={data.start} name="start" onChange={(e) => startDate(e.target.value)} /> */}
        </div>
        <NavLink to={`/meeting/${projectId}`}>
          <button>Meeting</button>
        </NavLink>
        <div>
          <h4>End Date</h4>
          <DateTimePicker
            value={data.end}
            onChange={(date) => changeDate(date, "end")}
          />
          {/* <Datetime value={data.end} name="end" onChange={(e) => endDate(e.target.value)}/> */}
        </div>
        <button>Add Event</button>
      </form>
    </Modal>
  );

  //     const users = useSelector((state) => state.home.users);
  //     const initialState = {title: ""}

  //     const [datos, setDatos] = useState(initialState)

  //     const {title} = datos

  //     function handlerUsers(){
  //         alert("poder agregar usuarios, no me mates shimer")
  //         // abre un modal donde se visualizan los usuarios para poder agregar
  //     }

  //     function handleConfirm(){
  //       setModalOpen(false)

  //     }

  //     function changeHandler(e){
  //       setDatos({
  //         ...datos,
  //         title: e.target.value
  //       })
  //     }

  //     function handleClose(){
  //       setDatos(initialState)
  //       setModalOpen(false)
  //     }

  //     return(
  //         <Modal
  //         style={customStyles}
  //         isOpen={ModalOpen}
  //         onRequestClose={() => setModalOpen(false)}
  //         >
  //             <h3>Title</h3>
  //             <h3>{date}</h3>
  //             <input onChange={(e) => changeHandler(e)} value={title} type="text" placeholder="Add title" className={style.Title}/>
  //             <button onClick={() => handlerUsers()}>Add users</button>
  //             <a href="https://meet.jit.si/" target="_blank">Meetin</a>
  //             <button onClick={ () => handleConfirm()}>Confirm</button>
  //             <button onClick= {() => handleClose()}>X</button>

  //         </Modal>
  //     )
}

export default CalendaryModal;
