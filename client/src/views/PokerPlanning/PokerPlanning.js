/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import TaskHolder from "../../components/TaskHolder/TaskHolder";
import { useEffect, useState } from "react";
import TaskCard from "../../components/TaskCard/TaskCard";

import styles from "./PokerPlanning.module.css";

const VALUES = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100, "?"];

const PokerPlanning = () => {
  const userRole = useSelector((state) => state.viewRouter.userRole);
  const socket = useSelector(({ app }) => app.socket);
  const loggedUser = useSelector(({ app }) => app.loggedUser);
  const { project, tasks } = useSelector(({ managerView }) => managerView);

  const [selectedVote, setSelectedVote] = useState(null);

  const [room, setRoom] = useState({});

  useEffect(() => {
    socket.emit("joinPokerPlanningRoom", {
      projectId: project._id,
      user: loggedUser,
    });

    socket.on("valueChanged", (room) => {
      setRoom(room);
    });

    socket.on("userJoined", (room) => {
      setRoom(room)
    });

    socket.on("newTaskSetted", (room) => {
      setRoom(room);
    });

    // return () => socket.disconnect();
  }, []);

  const handleButtonClick = (value) => {
    setSelectedVote(value)

    socket.emit("changeUserValue", { value, projectId: project._id, user: loggedUser });
  };

  const handleTaskClick = (task) => {
    console.log(task);

    socket.emit("setTask", { projectId: project._id, task });
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className="main-heading">{project.projectName}</h1>
      </header>
      <section className={styles.generalBoard}>
        <div className={styles.board}>
          <div className={styles.boardUsers}>
            {room.users && room.users.map(u => (
              <div className={styles.user} key={u._id}>
                <img src={u.picture} alt={u.name} />
                <p>{u.name}</p>
                {u.settedValue && <p>{u.settedValue}</p>}
              </div>
            ))}
          </div>
          <div className={styles.taskPlace}>
            {room.task ? (
              <TaskCard
                name={room.task.title}
                sp={room.task.storyPoints}
                complex={room.task.priorization}
                description={room.task.details}
              />
            ) : (
              <div className={styles.cardPlaceholder}>
                <p>Waiting for the scrum master to select a task.</p>
              </div>
            )}
          </div>
        </div>
        {userRole === "scrumMaster" ? (
          <div style={{width: "420px"}}>
            <TaskHolder
              customHandleClick={handleTaskClick}
              status="Unrated stories"
              taskList={tasks}
            />
          </div>
        ) : null}
      </section>
      <section className={styles.buttons}>
        {VALUES.map((v) => (
          <button className={`${selectedVote === v && styles.active}`} onClick={() => handleButtonClick(v)}>{v}</button>
        ))}
      </section>
    </section>
  );
};

export default PokerPlanning;
