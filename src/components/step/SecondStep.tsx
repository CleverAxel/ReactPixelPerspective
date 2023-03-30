import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Crop, PercentCrop } from "react-image-crop";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ButtonNextStep from "./ButtonNextStep";
import ButtonPrevStep from "./ButtonPrevStep";

export default function SecondStep(props:{
    objectURL:string|null,
    setStep:Dispatch<SetStateAction<number>>,
    setCrop:Dispatch<SetStateAction<Crop | null>>
    crop:Crop|null
}){
    const [crop, setCrop] = useState<Crop>(props.crop ?? {
        unit: 'px',
        x: 0,
        y: 0,
        width: 100,
        height: 100
    });

    return (
        <div>
            <h2 className="font-inter font-black text-4xl text-center mt-4">Seconde étape :</h2>
            <h3 className="font-inter font-black text-2xl text-center">Recadrer l'image</h3>
            {
                props.objectURL != null &&
                <>
                <div className="max-w-md mx-auto flex items-center justify-center mt-4 border-2 p-3 border-dashed border-gray-800">
                    <ReactCrop onComplete={(crop, percentageCrop) => {setCrop(percentageCrop)}} keepSelection={true} crop={crop} aspect={1} onChange={(c) => {setCrop(c)}}>
                        <img src={props.objectURL} alt=""/>
                    </ReactCrop>
                </div>
                <div className="flex justify-center gap-2 my-4">
                    <ButtonPrevStep onClick={() => {props.setStep((prev) => prev - 1)}} disabled={false}></ButtonPrevStep>

                    <ButtonNextStep onClick={() => {
                        props.setStep((prev) => prev + 1);
                        props.setCrop(crop);
                    }} disabled={props.objectURL == null || crop.unit == "px"}></ButtonNextStep>
                </div>
                </>
            }
        </div>
    )
}