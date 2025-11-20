'use client';

import React, { useState, FormEvent } from 'react';
import { bookingAPI, ApiError } from '../lib/api';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const BookingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    const phoneRegex = /^[0-9+\-() ]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date required';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date required';
    } else if (formData.checkIn && formData.checkOut <= formData.checkIn) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }

    if (!formData.guests || parseInt(formData.guests) < 1) {
      newErrors.guests = 'Select at least 1 guest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading || isSubmitted) {
      return;
    }
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      // Clear any existing timeout
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      try {
        // Map frontend fields to backend expected fields
        const bookingData = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          checkInDate: formData.checkIn,
          checkOutDate: formData.checkOut,
          guests: parseInt(formData.guests),
          message: formData.message || undefined,
        };
        
        const response = await bookingAPI.createBooking(bookingData);
        
        console.log('Booking created:', response);
        setIsSubmitted(true);
        setIsLoading(false);
        
        // Scroll to show success message
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Reset form after 5 seconds
        timeoutId.current = setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            checkIn: '',
            checkOut: '',
            guests: '1',
            message: '',
          });
          setIsSubmitted(false);
          timeoutId.current = null;
        }, 5000);
      } catch (error) {
        console.error('Error creating booking:', error);
        
        if (error instanceof ApiError) {
          setApiError(error.message);
        } else {
          setApiError('Failed to submit booking. Please try again later.');
        }
        setIsLoading(false);
        
        // Scroll to show error message
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <section id="booking" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Book Your Stay
          </h2>
          <p className="text-lg text-gray-600">
            Fill out the form below and we'll get back to you shortly
          </p>
        </div>

        {isSubmitted && (
          <div className="mb-6 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 px-8 py-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-2">
              <svg className="w-8 h-8 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-bold text-xl">Success!</p>
            </div>
            <p className="text-base ml-11">Your booking request has been submitted!</p>
            <p className="text-sm ml-11 mt-1">We'll contact you soon to confirm.</p>
          </div>
        )}

        {apiError && !isSubmitted && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-800 px-8 py-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-2">
              <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-bold text-xl">Error!</p>
            </div>
            <p className="text-base ml-11">{apiError}</p>
            <button
              onClick={() => setApiError('')}
              className="ml-11 mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal`}
                placeholder="+1 (234) 567-890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkIn" className="block text-sm font-semibold text-gray-700 mb-2">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border ${
                  errors.checkIn ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium`}
              />
              {errors.checkIn && (
                <p className="mt-1 text-sm text-red-500">{errors.checkIn}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkOut" className="block text-sm font-semibold text-gray-700 mb-2">
                Check-out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border ${
                  errors.checkOut ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium`}
              />
              {errors.checkOut && (
                <p className="mt-1 text-sm text-red-500">{errors.checkOut}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="guests" className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Guests <span className="text-red-500">*</span>
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 font-medium`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="mt-1 text-sm text-red-500">{errors.guests}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Any special requests or requirements..."
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading || isSubmitted}
              className={`w-full ${
                isLoading || isSubmitted
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
              } text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-xl disabled:transform-none`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : isSubmitted ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Submitted Successfully
                </span>
              ) : (
                'Submit Booking Request'
              )}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            <span className="text-red-500">*</span> Required fields
          </p>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;

