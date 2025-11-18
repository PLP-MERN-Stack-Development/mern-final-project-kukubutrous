import React from "react";

const VerifyEmail = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-xl w-96 text-center">
                <h1 className="text-xl font-semibold mb-3">Verify Your Email</h1>
                <p className="text-gray-600">
                    We’ve sent you a verification link. Please check your inbox and click the
                    link to verify your account.
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
