import { Dispatch, SetStateAction, useRef } from "react";
import { Crop } from "react-image-crop";
import Spinner from "../utils/Spinner";
import ButtonNextStep from "./ButtonNextStep";
import ButtonPrevStep from "./ButtonPrevStep";

export default function FourthStep(props:{
    setStep:Dispatch<SetStateAction<number>>,
    setSuccess:Dispatch<SetStateAction<boolean | null>>,
    crop:Crop | null,
    file:File | null,
    name:string
}){
    const refSpinner = useRef<HTMLDivElement>(null);
    const refButton = useRef<HTMLButtonElement>(null);
    const upload = () => {
        if(props.file){
            if(refButton.current){
                refButton.current.style.display = "none";
            }
            if(refSpinner.current){
                refSpinner.current.style.display = "block";
            }
            let formData = new FormData();
            formData.append("photo", props.file);
            formData.append("crop", JSON.stringify(props.crop ?? ""));
            formData.append("name", props.name);
            fetch("http://localhost:8000/store/image", {
            method: 'POST',
            body: formData,
            })
            .then((res) => {
                console.log(res);
                if(res.ok){
                    return res.json();
                }
            })
            .then((json) => {
                let isSuccess:boolean = json.success;          
                props.setSuccess(isSuccess);
                props.setStep(1);
            })
            .catch((err) => (console.log(err)));
        }
    }
    return (
        <div>
            <h2 className="font-inter font-black text-4xl text-center mt-4">Quatrième étape :</h2>
            <h3 className="font-inter font-black text-2xl text-center">Envoyer l'image</h3>
            <button ref={refButton} onClick={() => {upload()}} className="transition-all w-full border-4 border-solid border-gray-900 text-4xl py-2 my-4 rounded-full hover:border-white hover:text-white hover:bg-gray-900">
                <i className="fa-solid fa-paper-plane"></i>
            </button>
            <div className="flex justify-center">
                <Spinner refSpinner={refSpinner}></Spinner>
            </div>
            <div className="flex justify-center gap-2 my-4">
                <ButtonPrevStep onClick={() => {props.setStep((prev) => prev - 1)}} disabled={false}></ButtonPrevStep>
                <ButtonNextStep onClick={() => {}} disabled={true}></ButtonNextStep>
            </div>
        </div>
    )
}