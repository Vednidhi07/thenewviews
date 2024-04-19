import React from 'react'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function cart() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
      const onSubmit = async (data) => {
        const userInfo = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          file: data.file,
        };
        await axios
          .post("http://localhost:4001/Cart/cart", userInfo)
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              toast.success("Submited Successfully");
              document.getElementById("my_modal_4").close();
              setTimeout(() => {
                window.location.reload();
                localStorage.setItem("Users", JSON.stringify(res.data.user));
              }, 1000);
            }
          })
          .catch((err) => {
            if (err.response) {
              console.log(err);
              toast.error("Error: " + err.response.data.message);
              setTimeout(() => {}, 2000);
            }
          });
      };
  return (
    <><div id='my_model_4' className="flex h-screen items-center justify-center">
    <div className='modal-box'>
      <form onSubmit={handleSubmit(onSubmit)} method='dialog'>
      <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_4").close()}
            >
              ✕
            </Link>
        <h3>Payment Details: </h3>
        <div className='mt-4'>
            <div>
        <span>Name: </span><br />
            <input type="name" placeholder='Enter your Name..' className='w-80 px-3 py-1 border rounded-md outline-none m-4' {...register("name", { required: true })}/><br />
            {errors.name && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
              </div>
              <div>
            <span>Email: </span><br />
            <input type="email" placeholder='Enter your Email..' className='w-80 px-3 py-1 border rounded-md outline-none m-4' {...register("email", { required: true })}/><br />
            {errors.email && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div>
            <span>Phone: </span><br />
            <input type="phone" placeholder='Enter your phone number..' className='w-80 px-3 py-1 border rounded-md outline-none m-4' {...register("phone", { required: true })}/><br />
            {errors.number && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div>
            <span>Upload Payment Screenshot: </span><br />
            <input type="file" className='w-80 px-3 rounded-md outline-none m-4' {...register("file", { required: true })}/>
            {errors.file && (
                <div className="text-sm text-red-500">
                  This field is required
                </div>
              )}
            </div>
        </div>
        <div>
            <button className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200'>Submit</button>
        </div>
      </form>
    </div>
    </div></>
  )
}

export default cart
