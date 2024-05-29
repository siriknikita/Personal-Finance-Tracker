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

const schema = z.object({
  amount: z.coerce.number().positive(),
  categoryID: z.string().min(1),
});

function TransactionForm() {
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
      await sendPostData("transactions/add", {
        userID: user.userID,
        amount: data.amount,
        categoryID: data.categoryID,
      });
      navigate("/dashboard");
      toast.success("Transaction added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction!");
      setError("amount", {
        message: "Failed to add transaction",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Add a transaction</title>
      </Helmet>
      <Header
        title="Add a transaction"
        subtitle="Enter your transaction details"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Choose a category */}
        <label>
          Choose a category:
          <select
            {...register("categoryID", {
              required: "Category is required",
            })}
          >
            <option value="1">Groceries</option>
            <option value="2">Utilities</option>
            <option value="3">Rent</option>
            <option value="4">Entertainment</option>
            <option value="5">Healthcare</option>
            <option value="6">Transportation</option>
            <option value="7">Other</option>
          </select>
        </label>
        {!errors.categoryID && (
          <>
            <br />
          </>
        )}
        {errors.categoryID && <div>{errors.categoryID.message}</div>}
        {/* Enter amount of money */}
        <label>
          Enter amount of money ($):
          <br />
          <input
            {...register("amount", {
              required: "Amount is required",
            })}
            type="number"
            placeholder="Amount"
          />
        </label>
        {!errors.amount && <br />}
        {errors.amount && <div>{errors.amount.message}</div>}
        {/* Submit button */}
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding transaction..." : "Add transaction"}
        </button>
      </form>
    </>
  );
}

export default TransactionForm;
