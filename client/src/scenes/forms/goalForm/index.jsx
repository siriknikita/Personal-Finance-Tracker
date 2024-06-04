import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { Header } from "../../../components";
import { UserContext } from "../../../contexts";
import { sendPostData } from "../../../services/dataProcessing";

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
      console.log(data);
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

  if (errors) {
    for (const error in errors) {
      toast.error(errors[error].message);
    }
  }

  return (
    <>
      <Helmet>
        <title>Goal Form</title>
      </Helmet>
      <Header title="Add a goal" subtitle="Enter your goal details" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            Goal
            <input
              {...register("goal", {
                required: "Goal description is required",
              })}
              type="text"
              className="grow"
              placeholder="Goal Description"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Deadline
            <input
              {...register("deadline", {
                required: "Deadline is required",
              })}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="grow"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </label>
        </div>
        <button
          disabled={isSubmitting}
          className="btn btn-neutral mt-4 w-32 max-w-36"
          type="submit"
        >
          {isSubmitting ? "Adding goal..." : "Add goal"}
        </button>
      </form>
    </>
  );
}

export default GoalForm;
