import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import PRList from "../components/PRList";
import PRDraggable from "../components/PRDraggable";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import "../css/UserBoard.css";
import EmptyDashboard from "../components/EmptyDashboard";
import Spinner from "../components/Spinner";

const UserDashboard = () => {
  const { getUserMultiplePRs, getAssignedPRs, changePRStatus, spinner } = useAuth();
  const [userPrs, setUserPrs] = useState([]);
  const [userAssignedPrs, setUserAssignedPrs] = useState([]);
  
  const [notStarted, setNotStarted] = useState([]);
  const [suggested_changes, setSuggestedChanges] = useState([]);
  const [pr_approved, setPrApproved] = useState([]);

  const [needsReview, setNeedsReview] = useState(0);
  const [approved, setApproved] = useState(0);
  const [total, setTotal] = useState(0);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

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
      prApprovedPr = pr_approved,
      suggestedChangesPr = suggested_changes;

    //put PR into the destination position
    if (source.droppableId === "Not Started") {
      add = notStartedPr[source.index];
      notStartedPr.splice(source.index, 1);
    } else if (source.droppableId === "Suggested Changes") {
      add = suggestedChangesPr[source.index];
      suggestedChangesPr.splice(source.index, 1);
    } else {
      add = prApprovedPr[source.index];
      prApprovedPr.splice(source.index, 1);
    }

    if (destination.droppableId === "Not Started") {
      notStartedPr.splice(destination.index, 0, add);
      await changePRStatus({ id: draggableId, status: "Not Started" });
    } else if (destination.droppableId === "Suggested Changes") {
      suggestedChangesPr.splice(destination.index, 0, add);
      await changePRStatus({ id: draggableId, status: "Suggested Changes" });
    } else {
      prApprovedPr.splice(destination.index, 0, add);
      await changePRStatus({ id: draggableId, status: "PR Approved" });
    }

    setNotStarted(notStartedPr);
    setSuggestedChanges(suggestedChangesPr);
    setPrApproved(prApprovedPr);
  };

  useEffect(() => {
    const getUserPR = async () => {
      const searchUserPrs = await getUserMultiplePRs();
      setUserPrs(searchUserPrs);

      console.log(searchUserPrs);

      //Obtain PR that needs review
      const needsReviewList = searchUserPrs.filter(
        (PR) => PR.review_status === "reviews_welcomed"
      );

      setNeedsReview(needsReviewList.length);

      //Obtain PR that are approved

      const approvedList = searchUserPrs.filter(
        (PR) => PR.review_status === "approved"
      );

      setApproved(approvedList.length);

      //Obtain total PRs
      setTotal(needsReviewList.length + approvedList.length);
    };

    const getUserAssignedPR = async () => {
      const searchAssigedUserPrs = await getAssignedPRs();
      const userNotStarted = searchAssigedUserPrs.filter((PR) => PR.gitflowHubStatus === "Not Started");
      setNotStarted(userNotStarted);

      const userSuggestedChanges = searchAssigedUserPrs.filter((PR) => PR.gitflowHubStatus === "Suggested Changes");
      setSuggestedChanges(userSuggestedChanges);

      const userPrApproved = searchAssigedUserPrs.filter((PR) => PR.gitflowHubStatus === "PR Approved");
      setPrApproved(userPrApproved);

      setUserAssignedPrs(searchAssigedUserPrs);
    };

    getUserPR();
    getUserAssignedPR();
  }, []);

  return (
    <>
      {!spinner ? (
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-evenly mt-5 ml-8 mr-8">
              <div className="w-1/3 mr-1 ml-2">
                <div className="bg-white border-black rounded-t-md mb-1 pb-1 flex justify-center font-bold board-title">
                  NOT STARTED
                </div>
                <Droppable droppableId="Not Started">
                  {(provided, snapshot) => (
                    <div
                      className={`w-full  bg-white pt-1 border border-black rounded-b-md ${
                        snapshot.isDraggingOver ? "bg-slate-600" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {notStarted && notStarted.length > 0 ? (
                        notStarted.map((pull, index) => (
                          <PRDraggable
                            key={pull.id}
                            pull={pull}
                            index={index}
                          />
                        ))
                      ) : (
                        <EmptyDashboard bgColor="white" />
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <div className="w-1/3 mr-1 ml-1">
                <div className="bg-slate-200 border-black rounded-t-md mb-1 pb-1 flex justify-center font-bold board-title">
                SUGGESTED CHANGES
                </div>
                <Droppable droppableId="Suggested Changes">
                  {(provided, snapshot) => (
                    <div
                      className={`w-full bg-slate-200 pt-1 border border-black rounded-b-md ${
                        snapshot.isDraggingOver ? "bg-slate-500" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {suggested_changes && suggested_changes.length > 0 ? (
                        suggested_changes.map((pull, index) => (
                          <PRDraggable
                            key={pull.id}
                            pull={pull}
                            index={index}
                          />
                        ))
                      ) : (
                        <EmptyDashboard bgColor="slate-200" />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <div className="w-1/3 mr-2 ml-1">
                <div className="bg-slate-400 border-black rounded-t-md mb-1 pb-1 flex justify-center font-bold board-title">
                  APPROVED
                </div>
                <Droppable droppableId="PR Approved">
                  {(provided, snapshot) => (
                    <div
                      className={`w-full bg-slate-400 pt-1 border border-black rounded-b-md ${
                        snapshot.isDraggingOver ? "bg-slate-500" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {pr_approved && pr_approved.length > 0 ? (
                        pr_approved.map((pull, index) => (
                          <PRDraggable
                            key={pull.id}
                            pull={pull}
                            index={index}
                          />
                        ))
                      ) : (
                        <EmptyDashboard bgColor="slate-400" />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>

          <div className="m-8 bg-gray-300 border border-black rounded-md">
            <div className="flex flex-row items-center m-4 border-b border-gray-400">
              <p className="ml-3 mr-3 font-bold ">User owner Repo list</p>
              <div className="w-full lg:w-1/3 flex justify-between mx-3">
                <p className=" review-label needs-review ">
                  ⚠ Needs Review: {needsReview}
                </p>
                <p className=" review-label approved">✔ Approved: {approved}</p>
                <p className=" review-label total">TOTAL: {total}</p>
              </div>
            </div>

            <div className="ml-5">
              {userPrs &&
                userPrs.map((pull) => <PRList key={pull.id} pull={pull} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row align-middle justify-center ml-30">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default UserDashboard;
