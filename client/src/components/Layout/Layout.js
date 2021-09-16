/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Chat } from "../../views/Chat/Chat";
import { BsChatDots } from "react-icons/bs";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children }) => {
  const { loggedUser, socket } = useSelector(({ app }) => app);
  const role = useSelector((state) => state.viewRouter.userRole);
  const history = useHistory();

  const [buttonOpen, setButtonOpen] = useState(false);

  console.log(role);

  useEffect(() => {
    if (socket.on && loggedUser) {
      socket.on("newTaskAssigned", ({ userId, projectId }) => {
        if (loggedUser._id === userId) {
          toast.info("You have a new task assigned.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClick: () => {
              history.push(`/project/${projectId}`);
            },
          });
        }
      });
    }
  }, [loggedUser]);

  return (
    <>
      <Header />
      <main style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          limit={3}
        />
        <Sidebar />
        {children}
        <div>
          {role && (
            <button onClick={() => setButtonOpen(!buttonOpen)}
              style={{borderRadius: "32px", padding: "12px", height: "64px", width: "64px",
                      backgroundColor: "white", color: "#a12464", border: "none",
                      boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.2)", position: "fixed",
                      zIndex: "100000", right: "30px", bottom: "20px"
                    }}
            >
              <BsChatDots size={30} />
            </button>
          )}
        </div>
      </main>
      <div>
        {(buttonOpen && role) && (
          <Chat buttonOpen={buttonOpen} setButtonOpen={setButtonOpen} />
        )}{" "}
      </div>
      {/* <div>{userRole && <Chat />}</div> */}
    </>
  );
};

export default Layout;
