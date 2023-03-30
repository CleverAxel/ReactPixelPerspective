import { Dispatch, SetStateAction } from "react";

export default function ButtonPrevStep(props:{
    onClick:React.MouseEventHandler<HTMLButtonElement>
    disabled:boolean,
}){
    return(
        <button onClick={props.onClick} disabled={props.disabled} className="disabled:cursor-not-allowed disabled:opacity-25 hover:bg-blue-400 bg-blue-300 text-2xl py-2 px-4 font-bold uppercase rounded-full">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
    )
}