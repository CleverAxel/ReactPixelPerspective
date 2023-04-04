import { useEffect, useRef, useState } from "react";
import { Crop } from "react-image-crop";
import { CSSTransition } from 'react-transition-group';
import 'react-toastify/dist/ReactToastify.css';
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import FourthStep from "./FourthStep";
import "./step.css";
import { ToastContainer, toast } from "react-toastify";
import ThirdStep from "./ThirdStep";

export default function Steps(){
    const [objectURL, setObjectURL] = useState<string | null>(null);
    const [name, setName] = useState("");
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

    //useeffect pour l'input file du fichier
    useEffect(() => {
        console.log("effect file");
        
        if(file){
            if(objectURL)
                URL.revokeObjectURL(objectURL);
                
            setObjectURL(URL.createObjectURL(file));
            setCrop(null);
        }
    }, [file]);

    //useeffect next step
    useEffect(() => {
        if(successUpload == true){
            toast.success('Image ajoutée', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }else if(successUpload == false){
            toast.error('Un problème est survenu', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

        if(successUpload != null){
            URL.revokeObjectURL(objectURL ?? "");
            setObjectURL(null);
            setSuccessUpload(null);
            setName("");
        }
        
        setTimeout(() => {
            if(refProgressBar.current){
                refProgressBar.current.style.transform = `scaleX(${step * 25}%)`;
            }
        });
    }, [step])


    return(
        <>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            ></ToastContainer>
            <div className="bg-white p-3">
                <div className="relative w-full">
                    <div ref={refProgressBar} hidden className="rounded-3xl absolute left-0 mx-auto h-2 bg-orange-400 w-full origin-left transition duration-700 ease-out"></div>
                </div>
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
                    <ThirdStep setStep={setStep} setName={setName} name={name}></ThirdStep>
            }
            {
                step == 4 &&
                    <FourthStep setStep={setStep} setSuccess={setSuccessUpload} name={name} file={file} crop={crop}></FourthStep>
            }
            </div>
        </>
    )
}