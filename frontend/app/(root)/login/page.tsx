/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { login } from "@/lib/auth"; // Ensure these paths are correct
import { authInput } from "@/validators/auth"; // Ensure this path is correct
import { FiEye, FiEyeOff } from "react-icons/fi";
import { redirect } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: [], password: [], general: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await authInput.safeParseAsync(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.errors.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = acc[curr.path[0]] ? [...acc[curr.path[0]], curr.message] : [curr.message];
        return acc;
      }, { username: [], password: [] });
      setErrors(fieldErrors);
    } else {
      setErrors({ username: [], password: [], general: "" });
      const result = await login({ username: formData.username, password: formData.password });

      if (result.success) {
        alert('Login Successful')
        redirect('/')
      } else {
        setErrors((prev) => ({ ...prev, general: result.error || ""}));
      }
    }
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex h-[800px] w-[600px] rounded-3xl bg-gradient-to-br from-[#c2e0d3] to-[#b3c7f9] text-black flex-col items-center'>
        <div className='flex w-full pt-20 text-4xl font-semibold justify-center text-[#1f2a44]'>
          Login
        </div>
        <form onSubmit={handleLogin} className='flex-grow flex-col flex mt-52 items-center'>
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            className='bg-white h-[50px] w-[350px] rounded-2xl shadow-custom px-4'
          />
          {errors.username.length > 0 && (
            <ul className='mt-2 space-y-1'>
              {errors.username.map((err, index) => (
                <li key={index} className='text-red-500 text-sm'>
                  • {err}
                </li>
              ))}
            </ul>
          )}
          <div className='relative mt-5'>
            <input
              type={showPassword ? "text" : "password"}
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              className='bg-white h-[50px] w-[350px] rounded-2xl shadow-custom px-4'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-2 top-3 text-gray-500'
              aria-label='Toggle password visibility'
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.password.length > 0 && (
            <ul className='mt-2 space-y-1'>
              {errors.password.map((err, index) => (
                <li key={index} className='text-red-500 text-sm'>
                  • {err}
                </li>
              ))}
            </ul>
          )}
          <button
            type='submit'
            className='bg-[#1f2a44] text-white h-[50px] w-[350px] rounded-2xl mt-5 shadow-custom'
          >
            Login
          </button>
          {errors.general && (
            <div className='mt-2 text-red-500 text-sm'>
              {errors.general}
            </div>
          )}
        </form>
        <div className='pb-56'>
          <span className='text-gray-600'>New? </span>
          <Link href='/register' className='text-blue-500 hover:underline'>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;