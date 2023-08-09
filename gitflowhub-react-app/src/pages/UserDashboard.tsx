import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import PR from "../components/PR";
import PRDraggable from "../components/PRDraggable";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

const UserDashboard = () => {
  const { auth, updateUserProfile, getUserMultiplePRs, getAssignedPRs } =
    useAuth();
  const [userPrs, setUserPrs] = useState([]);
  const [userAssignedPrs, setUserAssignedPrs] = useState([]);

  const [notStarted,setNotStarted]=useState([])
  const [iceBox,setIceBox]=useState([])
  const [reviewed,setReviewed]=useState([])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    //If we drag into a non draggable element, do nothing
    if (!destination) {
      return;
    }

    //If we drag into the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add,active =userAssignedPrs


  };

  useEffect(() => {
    const getUserPR = async () => {
      const searchUserPrs = await getUserMultiplePRs();
      setUserPrs(searchUserPrs);
    };

    const getUserAssignedPR = async () => {
      const searchAssigedUserPrs = await getAssignedPRs();
      setUserAssignedPrs(searchAssigedUserPrs);
    };

    getUserPR();
    getUserAssignedPR();
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        Draggable Menu
        <div className="flex justify-evenly ">
          <Droppable droppableId="Not Started">
            {(provided) => (
              <div
                className="w-1/3 flex flex-col bg-white"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span> NOT STARTED</span>
                {userAssignedPrs?.map((pull, index) => (
                  <PRDraggable key={pull.id} pull={pull} index={index} />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="Icebox">
            {(provided) => (
              <div
                className="w-1/3 bg-slate-200"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span> ICEBOX</span>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="Reviewed">
            {(provided) => (
              <div
                className="w-1/3 bg-slate-400"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span>REVIEWED</span>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <div>
        User owner Repo list
        {userPrs && userPrs.map((pull) => <PR key={pull.id} pull={pull} />)}
      </div>
    </div>
  );
};

export default UserDashboard;
