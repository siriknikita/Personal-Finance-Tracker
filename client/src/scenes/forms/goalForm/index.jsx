import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { UserContext } from "../../../contexts";
import { Header } from "../../../components";
import { sendPostData } from "../../../services/dataProcessing";

// TODO: Create a separate component to encapsulate form field (label, error and so on)

const schema = z.object({
  goal: z.string().min(1).max(100),
  deadline: z.string().date().min(new Date().toISOString().split("T")[0]),
});

function GoalForm() {
  const { user } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await sendPostData("goals/set", {
        userID: user.userID,
        goal: data.goal,
        deadline: data.deadline,
      });
      navigate("/goals");
      toast.success("Goal added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add goal!");
      setError("goal", {
        message: "Failed to add goal",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Goal Form</title>
      </Helmet>
      <Header title="Add a goal" subtitle="Enter your goal details" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Goal:</label>
        <br />
        <input
          {...register("goal", {
            required: "Goal description is required",
          })}
          type="text"
          placeholder="Your goal description here"
        />
        {!errors.goal && <br />}
        {errors.goal && <div>{errors.goal.message}</div>}
        <label>Deadline:</label>
        {!errors.deadline && <br />}
        <input
          {...register("deadline", {
            required: "Deadline is required",
          })}
          type="date"
          min={new Date().toISOString().split("T")[0]}
        />
        {!errors.deadline && <br />}
        {errors.deadline && <div>{errors.deadline.message}</div>}
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding goal..." : "Add goal"}
        </button>
      </form>
    </>
  );
}

export default GoalForm;
