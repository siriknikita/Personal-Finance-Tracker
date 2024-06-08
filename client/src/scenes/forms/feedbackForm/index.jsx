import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "../../../components";
import { UserContext } from "../../../contexts";
import { sendPostData } from "../../../services/dataProcessing";
import { feedbackSchema } from "../../forms/schemas";

function FeedbackForm() {
  const { user } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = async (data) => {
    if (data.photoData && data.photoData[0]) {
      handleFileUpload();
    }

    try {
      const message = await sendPostData(
        "email/feedback",
        {
          feedback: data.feedback,
          userEmail: user.email,
          hasPhoto: data.photoData && data.photoData[0] ? true : false,
          filename: selectedFile?.name,
        },
        "message"
      );
      console.log("message", message);
      toast.success("Feedback sent successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send feedback or upload screenshot!");
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          const base64File = reader.result.split(",")[1];

          await sendPostData(
            "blob/upload/screenshot",
            {
              base64File,
              filename: selectedFile.name,
            },
            "message"
          );
        };
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <>
      <Helmet>
        <title>Feedback Form</title>
      </Helmet>
      <Header title="Add a goal" subtitle="Enter your goal details" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-4 items-center justify-center"
        encType="multipart/form-data"
      >
        <div className="flex flex-col w-[70%] items-center">
          <div className="grow w-[100%]">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Your Feedback Here:</span>
              </div>
              <textarea
                {...register("feedback", {
                  required: "Feedback is required",
                })}
                className="textarea textarea-bordered h-24"
                placeholder="Feedback here"
              ></textarea>
            </label>
          </div>
          <div className="grow w-[100%] mt-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Upload Screenshot:</span>
              </div>
              <input
                {...register("photoData")}
                type="file"
                onChange={handleFileChange}
                className="input input-bordered"
              />
            </label>
          </div>
          <button
            disabled={isSubmitting}
            className="btn btn-neutral w-32 max-w-36 mt-4"
            type="submit"
          >
            {isSubmitting ? "Adding feedback..." : "Add feedback"}
          </button>
        </div>
      </form>
    </>
  );
}

export default FeedbackForm;
