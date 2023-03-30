import { useEffect, useRef } from "react"

export default function MainCanvas(){
    const sizeCanvas = 792;
    const sizePixel = 72;
    const refCanvas = useRef<HTMLCanvasElement>(null);
    let target = {
        x : 648,
        y : 360,
    }
    useEffect(() => {
        if(refCanvas.current){

            let ctx = refCanvas.current.getContext("2d");
            let pixelImg = new Image();
            pixelImg.src = "/assets/images/pixelatedtest.png";

            pixelImg.onload = () => {
                let nbrPixel = pixelImg.width / sizePixel;                
                let newPixelSize = sizeCanvas / nbrPixel;
                
                let newRatio = pixelImg.width / sizeCanvas;
                target.x /= newRatio;
                target.y /= newRatio;

                ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);

                
                let photo = new Image();
                photo.src = "/assets/images/photo.png";
                photo.onload = () => {
                    console.log( 9 * newPixelSize);
                    console.log( 5 * newPixelSize);
                    
                    ctx?.drawImage(photo, target.x , target.y, newPixelSize, newPixelSize);
                }
            }
        }
    }, [])
    return(
        <>
            <canvas className="mx-auto" ref={refCanvas} width={sizeCanvas} height={sizeCanvas}>

            </canvas>
        </>
    )
}