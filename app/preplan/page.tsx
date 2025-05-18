"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/header";
import StepsStatusBar from "../components/progressSlideBar";
import RangeCalendar from "../components/RangeCalendar";
import BudgetOption from "../components/BudgetOption";
import TypeOfPeople from "../components/typeOfPeople";

const PrePlanTrip = () => {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");

    const [currentStep, setCurrentStep] = useState<"date" | "budget" | "people">(
        "date"
    );
    const [processNum, setProcessNum] = useState<number>(0);
    const totalProcess = 3;

    const [dateRng, setDateRng] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    });
    const [budgetOpt, setBudgetOpt] = useState<string | null>(null);
    const [peopleOpt, setPeopleOpt] = useState<{
        selectedStr: string;
        adultsNum: number;
        childrenNum: number;
    }>({
        selectedStr: "",
        adultsNum: 1,
        childrenNum: 0,
    });

    const ms = 250;

    // Redirect if destination is missing
    useEffect(() => {
        if (!destination && typeof window !== "undefined") {
            window.location.href = "/";
        }
    }, [destination]);

    const handleNextStep = () => {
        setProcessNum((prev) => Math.min(prev + 1, totalProcess));
    };

    const handlePreviousStep = () => {
        setProcessNum((prev) => Math.max(prev - 1, 0));
    };


    function sendAPIstoreRedirect(peopleTy:{selc: string, adls: number, chls: number}) {
        const sDate = dateRng.startDate?.toISOString().split("T")[0];
        const eDate = dateRng.endDate?.toISOString().split("T")[0];
        fetch("/api/planstore", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            destination,
            startDate: sDate,
            endDate: eDate,
            budget: budgetOpt,
            peopleType: peopleTy.selc,
            adults: peopleTy.adls,
            children: peopleTy.chls,
            }),
        })
            .then((response) => {
                
            // if (response.ok) {
            //     window.location.href = `/plan/`;
            // } else {
            //     console.error("Failed to save trip details");
            // }
            })
            .catch((error) => {
            console.error("Error:", error);
            });

    }


    if (!destination) {
        return null;
    }

    return (
        <>
            <Header />
            <div className="p-6 max-w-[500px] mx-auto mt-[10px]">
                <div className="text-[16px] text-gray-800 leading-tight font-[geist]">
                    <span>Your Trip to</span>
                    <span className="mt-2 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text px-2 py-1 w-fit font-bold">
                        {destination}
                    </span>
                </div>
                <div className="gap-1 flex">
                    {dateRng.startDate && dateRng.endDate && (
                        <button
                            className="px-3 py-1 h-fit text-sm border border-gray-300 text-gray-700 rounded-md transition-all mt-2 font-semibold cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:text-transparent bg-clip-text hover:opacity-80"
                            onClick={() => {
                                setCurrentStep("date");
                                setDateRng({ startDate: dateRng.startDate, endDate: dateRng.endDate });
                                setProcessNum(0);
                            }}
                        >
                            {`${Math.ceil(
                                (dateRng.endDate.getTime() - dateRng.startDate.getTime()) /
                                    (1000 * 60 * 60 * 24) +
                                    1
                            )} days`}
                        </button>
                    )}
                    {budgetOpt && (
                        <button
                            className="px-3 py-1 h-fit text-sm border border-gray-300 text-gray-700 rounded-md transition-all mt-2 font-semibold cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:text-transparent bg-clip-text hover:opacity-80"
                            onClick={() => {
                                setCurrentStep("budget");
                                setProcessNum(1);
                            }}
                        >
                            {budgetOpt}
                        </button>
                    )}
                    {peopleOpt.selectedStr && (
                        <button
                            className="px-3 py-1 h-fit text-sm border border-gray-300 text-gray-700 rounded-md transition-all mt-2 font-semibold cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:text-transparent bg-clip-text hover:opacity-80"
                            onClick={() => {
                                setCurrentStep("people");
                                setProcessNum(2);
                            }}
                        >
                            {peopleOpt.selectedStr}
                        </button>
                    )}
                </div>
                <StepsStatusBar
                    ms={ms}
                    totalProgress={totalProcess}
                    currentProgress={processNum.toString()}
                    className="mt-[10px] mb-10"
                />
                {currentStep === "date" && (
                    <RangeCalendar
                        preselectedRange={{ start: dateRng.startDate, end: dateRng.endDate }}
                        onDateSelected={(date) => {
                            setTimeout(() => {
                                setDateRng({
                                    startDate: date.start,
                                    endDate: date.end,
                                });
                                setCurrentStep("budget");
                                handleNextStep();
                            }, ms);
                        }}
                    />
                )}
                {currentStep === "budget" && (
                    <BudgetOption
                    defaultSelected={budgetOpt}
                        onBudgetSelected={(budget: string) => {
                            setTimeout(() => {
                                setBudgetOpt(budget);
                                setCurrentStep("people");
                                handleNextStep();
                            }, ms);
                        }}
                    />
                )}
                {currentStep === "people" && (
                    <TypeOfPeople
                        onPeopletSelected={({
                            selectedStr: selected,
                            adultsNum: adults,
                            childrenNum: children,
                        }) => {

                            setPeopleOpt({
                                selectedStr: selected,
                                adultsNum: adults,
                                childrenNum: children,
                            });
                            handleNextStep();

                            sendAPIstoreRedirect({selc: selected, adls: adults, chls: children}); // Send data to API

                        }}
                    />
                )}
            </div>
        </>
    );
};

export default PrePlanTrip;
