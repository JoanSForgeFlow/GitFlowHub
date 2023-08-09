import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import PR from "../components/PR";
import PRDraggable from "../components/PRDraggable";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

const UserDashboard = () => {
  const { getUserMultiplePRs, getAssignedPRs,changePRStatus } =
    useAuth();
  const [userPrs, setUserPrs] = useState([]);
  const [userAssignedPrs, setUserAssignedPrs] = useState([]);

  const [notStarted, setNotStarted] = useState([]);
  const [iceBox, setIceBox] = useState([]);
  const [reviewed, setReviewed] = useState([]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination,draggableId} = result;

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

    let add,
      notStartedPr = notStarted,
      reviewedPr = reviewed,
      iceBoxPr = iceBox;

      //put PR into the destination position
    if (source.droppableId === "Not Started") {
      add = notStartedPr[source.index];
      notStartedPr.splice(source.index, 1);
    } else if (source.droppableId === "IceBox") {
      add = iceBoxPr[source.index];
      iceBoxPr.splice(source.index, 1);
    } else {
      add = reviewedPr[source.index];
      reviewedPr.splice(source.index, 1);
    }
    
    if (destination.droppableId === "Not Started") {
      notStartedPr.splice(destination.index, 0,add);
      await changePRStatus({id:draggableId,status:"Not Started"})
    } else if (destination.droppableId === "IceBox") {
      iceBoxPr.splice(destination.index, 0,add);
      await changePRStatus({id:draggableId,status:"IceBox"})
    } else {
      reviewedPr.splice(destination.index, 0,add);
      await changePRStatus({id:draggableId,status:"Reviewed"})
    }

    setNotStarted(notStartedPr)
    setIceBox(iceBoxPr)
    setReviewed(reviewedPr)
  };

  useEffect(() => {
    const getUserPR = async () => {
      const searchUserPrs = await getUserMultiplePRs();
      setUserPrs(searchUserPrs);
    };

    const getUserAssignedPR = async () => {
      const searchAssigedUserPrs = await getAssignedPRs();
      //Obtain User Not started PRs
      const userNotStarted = searchAssigedUserPrs.filter(
        (PR) => PR.gitflowHubStatus === "Not Started"
      );
      setNotStarted(userNotStarted);

      //Obtain User Icebox PRs
      const userIceBox = searchAssigedUserPrs.filter(
        (PR) => PR.gitflowHubStatus === "IceBox"
      );
      setIceBox(userIceBox);

      //Obtain User Reviewed PRs
      const userReviewed = searchAssigedUserPrs.filter(
        (PR) => PR.gitflowHubStatus === "Reviewed"
      );
      setReviewed(userReviewed);

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
            {(provided,snapshot) => (
              <div
                className={`w-1/3 flex flex-col bg-white ${snapshot.isDraggingOver? "bg-slate-600":""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span> NOT STARTED</span>
                {notStarted?.map((pull, index) => (
                  <PRDraggable key={pull.id} pull={pull} index={index} />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="IceBox">
            {(provided,snapshot) => (
              <div
                className={`w-1/3 bg-slate-200 ${snapshot.isDraggingOver? "bg-slate-500":""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span> ICEBOX</span>
                {iceBox?.map((pull, index) => (
                  <PRDraggable key={pull.id} pull={pull} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="Reviewed">
            {(provided,snapshot) => (
              <div
                className={`w-1/3 bg-slate-400 ${snapshot.isDraggingOver? "bg-slate-500":""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span>REVIEWED</span>
                {reviewed?.map((pull, index) => (
                  <PRDraggable key={pull.id} pull={pull} index={index} />
                ))}
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
