import { Dispatch, SetStateAction, useState } from "react";
import ButtonPrevStep from "./ButtonPrevStep";
import ButtonNextStep from "./ButtonNextStep";
import { ToastContainer, toast } from "react-toastify";

export default function ThirdStep(props:{
    setStep:Dispatch<SetStateAction<number>>,
    setName:Dispatch<SetStateAction<string>>,
    name:string
}){
    const [name, setName] = useState(props.name);
    const [isFree, setIsFree] = useState(props.name == "");
    
    const checkDisponibility = () => {
        fetch(`http://palabre.be/pixel-perspective/coordinate/get.php?name=${name.replace(" ", "+")}`)
        .then((res) =>{
            return res.json()
        })
        .then((json) => {
            if(json.success){                
                if(json.data == null){
                    toast.success('Nom libre !', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setIsFree(true);
                }else{
                    toast.error('Nom déjà pris', {
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
            }else{
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
        })
    }
    
    return(
        <div>
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
            <h2 className="font-inter font-black text-4xl text-center mt-4">Troisième étape :</h2>
            <h3 className="font-inter font-black text-2xl text-center">Choisir un nom (Optionnel)</h3>
            <h4 className="font-inter text-xl text-left">
                Laissez le champs vide pour ne pas spécifier le nom. Si vous en choisissez un, celui-ci aura comme but 
                de vous retrouver dans la mosaique si vous le souhaitez.
            </h4>
            <input maxLength={200} className="p-3 font-open text-lg my-3 w-full outline-none border border-solid border-gray-900" type="text" value={name} onChange={(e) => {
                setName(e.target.value); 
                setIsFree(e.target.value == "")
            }}/>
            
            <button onClick={checkDisponibility} className="transition-all w-full border-2 border-solid border-gray-900 text-xl py-2 mb-2 rounded-full hover:border-white hover:text-white hover:bg-gray-900">
                Regarder si ce nom est disponible
            </button>

            <div className="flex justify-center gap-2 my-4">
                <ButtonPrevStep onClick={() => {props.setStep((prev) => prev - 1)}} disabled={false}></ButtonPrevStep>
                <ButtonNextStep onClick={() => {props.setStep((prev) => prev + 1); props.setName(name)}} disabled={!isFree}></ButtonNextStep>
            </div>
        </div>
    );
}