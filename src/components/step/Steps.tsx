import { useEffect, useRef, useState } from "react";
import { Crop } from "react-image-crop";
import { CSSTransition } from 'react-transition-group';
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import "./step.css";
import ThirdStep from "./ThirdStep";

export default function Steps(){
    const [objectURL, setObjectURL] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState(1);
    const [crop, setCrop] = useState<Crop | null>(null);
    const [successUpload, setSuccessUpload] = useState<boolean | null>(null);

    const refProgressBar = useRef<HTMLDivElement>(null);
    //useeffect pour clean up URL.revoke
    useEffect(() => {
        if(refProgressBar.current){
            refProgressBar.current.hidden = false;
            refProgressBar.current.style.transform = "scaleX(0%)";
        }
        return () => {
            if(objectURL){
                URL.revokeObjectURL(objectURL);
            }
        }
    }, [])

    useEffect(() => {
        if(successUpload != null){
            if(successUpload){
                URL.revokeObjectURL(objectURL ?? "");
                setObjectURL(null);
                setStep(1);
            }
        }
    }, [successUpload])

    //useeffect pour l'input file du fichier
    useEffect(() => {
        if(file){
            if(objectURL)
                URL.revokeObjectURL(objectURL);
                
            setObjectURL(URL.createObjectURL(file));
            setCrop(null);
        }
    }, [file]);

    //useeffect next step
    useEffect(() => {
        setTimeout(() => {
            if(refProgressBar.current){
                refProgressBar.current.style.transform = `scaleX(${step * 33.33}%)`;
            }
        });
    }, [step])


    return(
        <div className="relative">
            <div ref={refProgressBar} hidden className="rounded-3xl absolute -top-4 left-0 mx-auto h-2 bg-orange-400 w-full origin-left transition duration-700 ease-out"></div>
        {
            step == 1 &&
                <FirstStep setFile={setFile} setStep={setStep} objectURL={objectURL}></FirstStep>
        }
        {
            step == 2 &&
                <SecondStep crop={crop} setStep={setStep} setCrop={setCrop} objectURL={objectURL}></SecondStep>
        }
                {
            step == 3 &&
                <ThirdStep setStep={setStep} setSuccess={setSuccessUpload} file={file} crop={crop}></ThirdStep>
        }
        </div>
    )
}