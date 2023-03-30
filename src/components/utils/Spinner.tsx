import "./spinner.css";
export default function Spinner(props:{refSpinner:React.RefObject<HTMLDivElement>}){
    return(
        <div ref={props.refSpinner} style={{display:"none"}} className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
}