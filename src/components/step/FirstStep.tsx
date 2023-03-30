import { Dispatch, SetStateAction, useState } from "react"
import ButtonNextStep from "./ButtonNextStep";
import ButtonPrevStep from "./ButtonPrevStep";

export default function FirstStep(props:{
    setFile:Dispatch<SetStateAction<File | null>>,
    setStep:Dispatch<SetStateAction<number>>,
    objectURL:string|null
}){


    const fileOnChange = (fileList:FileList |null) => {
        if(fileList){
            props.setFile(fileList[0]);
        }
    }

    return(
        <div>
            <h2 className="font-inter font-black text-4xl text-center mt-4">Première étape :</h2>
            <h3 className="font-inter font-black text-2xl text-center">Choisissez une photo à upload.</h3>
            <div>
                <label htmlFor="upload" className="flex justify-center items-center pointer group cursor-pointer w-28 mx-auto bg-gray-200 rounded-md p-2 hover:bg-gray-300">
                    <img src="/assets/images/portrait.png" alt="" className="group-hover:scale-110 transition-all"/>
                    <input type="file" onChange={(e) => {fileOnChange(e.target.files)}} name="upload" id="upload" hidden accept="image/*"/>
                </label>
            </div>
            { props.objectURL &&
                <div className="max-w-xs h-44 mx-auto flex items-center justify-center mt-4 border-2 p-3 border-dashed border-gray-800">
                    <img src={props.objectURL} alt="" className="w-full h-full object-contain" />
                </div>
            }
            <div className="flex justify-center gap-2 my-4">
                <ButtonPrevStep onClick={() => {}} disabled={true}></ButtonPrevStep>
                <ButtonNextStep onClick={() => {props.setStep((prev) => prev + 1)}} disabled={props.objectURL == null}></ButtonNextStep>
            </div>
        </div>
    )
}